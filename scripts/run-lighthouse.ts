import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { execFileSync, spawn, spawnSync } from "node:child_process";

type TargetPage = {
  slug: string;
  route: string;
};

type LighthouseJson = {
  finalUrl?: string;
  categories?: {
    performance?: {
      score?: number | null;
    };
  };
  audits?: Record<
    string,
    {
      numericValue?: number;
      details?: unknown;
    }
  >;
};

const DEFAULT_TARGETS: TargetPage[] = [
  { slug: "home", route: "/en" },
  { slug: "blog", route: "/en/blog" },
  { slug: "post", route: "/en/blog/2026-01-10_resource-management-naming" },
];

const DEV_ARTIFACT_PATTERNS = ["next-devtools", "hot-reloader-app.js", ".development.js"];
const OUTPUT_DIR = path.join(process.cwd(), "reports", "lighthouse");
const BUILD_SENTINEL_PATH = path.join(process.cwd(), "out", "index.html");
const STATIC_OUTPUT_DIR = path.join(process.cwd(), "out");
const HEALTHCHECK_PATH = "/en";
const DEFAULT_PORT = 3100;
const HEALTHCHECK_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 750;

function parseTargets() {
  const args = process.argv.slice(2).map((arg) => arg.trim()).filter(Boolean);

  if (args.length === 0) {
    return DEFAULT_TARGETS;
  }

  return args.map((route) => {
    const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
    const defaultTarget = DEFAULT_TARGETS.find((target) => target.route === normalizedRoute);

    if (defaultTarget) {
      return defaultTarget;
    }

    return {
      slug: normalizedRoute.replace(/^\/+/, "").replace(/[\\/]+/g, "-") || "root",
      route: normalizedRoute,
    };
  });
}

function getLatestMtime(targetPath: string): number {
  if (!fs.existsSync(targetPath)) {
    return 0;
  }

  const stat = fs.statSync(targetPath);
  if (!stat.isDirectory()) {
    return stat.mtimeMs;
  }

  let latest = stat.mtimeMs;

  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    if (
      entry.name === ".next"
      || entry.name === "out"
      || entry.name === "node_modules"
      || entry.name === ".git"
    ) {
      continue;
    }

    latest = Math.max(latest, getLatestMtime(path.join(targetPath, entry.name)));
  }

  return latest;
}

function ensureFreshProductionBuild() {
  if (!fs.existsSync(BUILD_SENTINEL_PATH)) {
    throw new Error("Missing out/index.html. Run `npm run build` before Lighthouse.");
  }

  const buildMtime = fs.statSync(BUILD_SENTINEL_PATH).mtimeMs;
  const latestSourceMtime = Math.max(
    getLatestMtime(path.join(process.cwd(), "src")),
    getLatestMtime(path.join(process.cwd(), "content")),
    getLatestMtime(path.join(process.cwd(), "messages")),
    getLatestMtime(path.join(process.cwd(), "next.config.js")),
    getLatestMtime(path.join(process.cwd(), "package.json")),
    getLatestMtime(path.join(process.cwd(), "content-collections.ts")),
  );

  if (latestSourceMtime > buildMtime) {
    throw new Error("Production build is stale. Run `npm run build` and retry Lighthouse.");
  }
}

function isPortFree(port: number) {
  return new Promise<boolean>((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "127.0.0.1");
  });
}

function getPortOccupant(port: number) {
  try {
    const rawConnection = execFileSync(
      "powershell.exe",
      [
        "-Command",
        `Get-NetTCPConnection -LocalPort ${port} -State Listen | Select-Object -First 1 OwningProcess, LocalAddress, LocalPort | ConvertTo-Json -Compress`,
      ],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();

    if (!rawConnection) {
      return null;
    }

    const connection = JSON.parse(rawConnection) as {
      OwningProcess?: number;
      LocalAddress?: string;
      LocalPort?: number;
    };

    if (!connection.OwningProcess) {
      return null;
    }

    const rawProcess = execFileSync(
      "powershell.exe",
      [
        "-Command",
        `Get-Process -Id ${connection.OwningProcess} | Select-Object -First 1 Id, ProcessName, Path | ConvertTo-Json -Compress`,
      ],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();

    const processInfo = rawProcess
      ? (JSON.parse(rawProcess) as { Id?: number; ProcessName?: string; Path?: string })
      : null;

    return {
      port,
      pid: processInfo?.Id ?? connection.OwningProcess,
      processName: processInfo?.ProcessName ?? "unknown",
      executablePath: processInfo?.Path,
    };
  } catch {
    return null;
  }
}

async function ensurePort3000IsClean() {
  if (await isPortFree(3000)) {
    return;
  }

  const occupant = getPortOccupant(3000);
  const details = occupant
    ? `Process ${occupant.processName} (PID ${occupant.pid}) is listening on port 3000${occupant.executablePath ? ` at ${occupant.executablePath}` : ""}.`
    : "A process is already listening on port 3000.";

  throw new Error(`${details} Stop the existing server before running production Lighthouse.`);
}

async function findAvailablePort(startPort: number) {
  let port = startPort;

  while (!(await isPortFree(port))) {
    port += 1;
  }

  return port;
}

async function waitForHealthcheck(port: number) {
  const deadline = Date.now() + HEALTHCHECK_TIMEOUT_MS;
  const url = `http://127.0.0.1:${port}${HEALTHCHECK_PATH}`;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.ok || response.status === 307 || response.status === 308) {
        return;
      }
    } catch {
      // keep polling
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error(`Timed out waiting for the static preview server to serve ${url}.`);
}

function resolveLighthouseCommand() {
  const localBin = path.join(
    process.cwd(),
    "node_modules",
    ".bin",
    process.platform === "win32" ? "lighthouse.cmd" : "lighthouse",
  );

  if (fs.existsSync(localBin)) {
    return {
      command: localBin,
      args: [] as string[],
    };
  }

  return {
    command: process.platform === "win32" ? "npx.cmd" : "npx",
    args: ["--yes", "lighthouse"],
  };
}

function validateLighthouseJson(outputPath: string) {
  if (!fs.existsSync(outputPath)) {
    throw new Error(`Lighthouse did not produce ${outputPath}.`);
  }

  const raw = fs.readFileSync(outputPath, "utf8");
  const parsed = JSON.parse(raw) as LighthouseJson;

  if (typeof parsed.categories?.performance?.score !== "number") {
    throw new Error(`Invalid Lighthouse report at ${outputPath}.`);
  }

  const devArtifact = DEV_ARTIFACT_PATTERNS.find((pattern) => raw.includes(pattern));
  if (devArtifact) {
    throw new Error(`Detected development artifact \`${devArtifact}\` in ${outputPath}.`);
  }

  return parsed;
}

function isKnownWindowsCleanupNoise(stderr: string) {
  return stderr.includes("Runtime error encountered: EPERM, Permission denied:")
    && stderr.includes("chrome-launcher")
    && stderr.includes("destroyTmp");
}

function removeDirectoryWithRetries(targetPath: string, retries = 5, delayMs = 300) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      fs.rmSync(targetPath, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
    }
  }
}

async function runLighthouse(baseUrl: string, target: TargetPage) {
  const outputPath = path.join(OUTPUT_DIR, `${target.slug}.json`);
  const { command, args } = resolveLighthouseCommand();
  const targetUrl = `${baseUrl}${target.route}`;
  const chromeProfileDir = path.join(OUTPUT_DIR, ".chrome", target.slug);

  removeDirectoryWithRetries(chromeProfileDir);
  fs.mkdirSync(chromeProfileDir, { recursive: true });

  const commandArgs = [
    ...args,
    targetUrl,
    "--output=json",
    "--output-path",
    outputPath,
    "--only-categories=performance",
    "--quiet",
    "--chrome-flags",
    `--headless=new --disable-gpu --no-first-run --no-default-browser-check --user-data-dir=${chromeProfileDir}`,
  ];

  console.log(`Running Lighthouse for ${targetUrl}`);

  const result =
    process.platform === "win32" && command.endsWith(".cmd")
      ? spawnSync(
          "powershell.exe",
          [
            "-NoProfile",
            "-Command",
            `& ${[command, ...commandArgs].map(quotePowerShellArg).join(" ")}`,
          ],
          {
            cwd: process.cwd(),
            env: process.env,
            encoding: "utf8",
          },
        )
      : spawnSync(command, commandArgs, {
          cwd: process.cwd(),
          env: process.env,
          encoding: "utf8",
        });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  const report = validateLighthouseJson(outputPath);

  if (result.stderr && !isKnownWindowsCleanupNoise(result.stderr)) {
    process.stderr.write(result.stderr);
  }

  if ((result.status ?? 0) !== 0) {
    if (isKnownWindowsCleanupNoise(result.stderr ?? "")) {
      console.warn(
        `Lighthouse hit a Windows temp cleanup issue after writing ${path.relative(process.cwd(), outputPath)}. Keeping the valid report.`,
      );
    } else {
      console.warn(
        `Lighthouse exited with code ${result.status ?? "null"}, but ${outputPath} is valid. Keeping the report.`,
      );
    }
  }

  try {
    removeDirectoryWithRetries(chromeProfileDir);
  } catch (error) {
    console.warn(
      `Unable to clean Lighthouse Chrome profile ${path.relative(process.cwd(), chromeProfileDir)}: ${error instanceof Error ? error.message : "unknown error"}`,
    );
  }

  return {
    outputPath,
    report,
    stderr: result.stderr ?? "",
  };
}

function quotePowerShellArg(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}

function readMetric(report: LighthouseJson, auditId: string) {
  return report.audits?.[auditId]?.numericValue ?? null;
}

async function main() {
  const targets = parseTargets();

  ensureFreshProductionBuild();
  await ensurePort3000IsClean();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const port = await findAvailablePort(DEFAULT_PORT);
  const serveJs = path.join(
    process.cwd(),
    "node_modules",
    "serve",
    "build",
    "main.js",
  );
  const serveBin = path.join(
    process.cwd(),
    "node_modules",
    ".bin",
    process.platform === "win32" ? "serve.cmd" : "serve",
  );

  const serverCommand = fs.existsSync(serveJs)
    ? process.execPath
    : fs.existsSync(serveBin)
      ? serveBin
    : (process.platform === "win32" ? "npx.cmd" : "npx");
  const serverArgs = fs.existsSync(serveJs)
    ? [serveJs, "-s", STATIC_OUTPUT_DIR, "-l", String(port)]
    : fs.existsSync(serveBin)
      ? ["-s", STATIC_OUTPUT_DIR, "-l", String(port)]
    : ["--yes", "serve", "-s", STATIC_OUTPUT_DIR, "-l", String(port)];

  const server = spawn(serverCommand, serverArgs, {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", "inherit", "inherit"],
  });

  try {
    await waitForHealthcheck(port);

    const baseUrl = `http://127.0.0.1:${port}`;
    const summaries: Array<Record<string, string | number | null>> = [];

    for (const target of targets) {
      const { outputPath, report } = await runLighthouse(baseUrl, target);
      const score = report.categories?.performance?.score;
      const fcp = readMetric(report, "first-contentful-paint");
      const lcp = readMetric(report, "largest-contentful-paint");
      const tbt = readMetric(report, "total-blocking-time");
      const tti = readMetric(report, "interactive");
      const cls = readMetric(report, "cumulative-layout-shift");

      summaries.push({
        page: target.route,
        output: path.relative(process.cwd(), outputPath),
        score: score != null ? Math.round(score * 100) : null,
        fcp_ms: fcp != null ? Math.round(fcp) : null,
        lcp_ms: lcp != null ? Math.round(lcp) : null,
        tbt_ms: tbt != null ? Math.round(tbt) : null,
        tti_ms: tti != null ? Math.round(tti) : null,
        cls: cls != null ? Number(cls.toFixed(3)) : null,
      });
    }

    console.table(summaries);
    console.log(`Saved ${summaries.length} production Lighthouse report(s) to ${path.relative(process.cwd(), OUTPUT_DIR)}.`);
  } finally {
    server.kill();
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
