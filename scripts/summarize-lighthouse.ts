import fs from "node:fs";
import path from "node:path";

type AuditItem = Record<string, unknown>;

type LighthouseReport = {
  categories?: {
    performance?: {
      score?: number | null;
    };
  };
  audits?: Record<
    string,
    {
      numericValue?: number;
      details?: {
        items?: AuditItem[];
        nodes?: AuditItem[];
      };
    }
  >;
};

type PageReport = {
  label: string;
  route: string;
  path: string;
};

const REPORTS: PageReport[] = [
  { label: "Home", route: "/en", path: path.join(process.cwd(), "reports", "lighthouse", "home.json") },
  { label: "Blog", route: "/en/blog", path: path.join(process.cwd(), "reports", "lighthouse", "blog.json") },
  {
    label: "Post",
    route: "/en/blog/2026-01-10_resource-management-naming",
    path: path.join(process.cwd(), "reports", "lighthouse", "post.json"),
  },
];

const OUTPUT_PATH = path.join(process.cwd(), "reports", "lighthouse", "SUMMARY.md");

function readReport(reportPath: string) {
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Missing Lighthouse report: ${path.relative(process.cwd(), reportPath)}`);
  }

  return JSON.parse(fs.readFileSync(reportPath, "utf8")) as LighthouseReport;
}

function getMetric(report: LighthouseReport, auditId: string) {
  return report.audits?.[auditId]?.numericValue ?? null;
}

function getAuditItems(report: LighthouseReport, auditId: string) {
  return (report.audits?.[auditId]?.details?.items ?? []) as AuditItem[];
}

function getTreeNodes(report: LighthouseReport) {
  return (report.audits?.["script-treemap-data"]?.details?.nodes ?? []) as AuditItem[];
}

function flattenTree(nodes: AuditItem[], acc: AuditItem[] = []) {
  for (const node of nodes) {
    if (typeof node.resourceBytes === "number") {
      acc.push(node);
    }

    if (Array.isArray(node.children)) {
      flattenTree(node.children as AuditItem[], acc);
    }
  }

  return acc;
}

function formatMs(value: number | null) {
  return value == null ? "-" : `${Math.round(value)} ms`;
}

function formatScore(value: number | null | undefined) {
  return value == null ? "-" : String(Math.round(value * 100));
}

function formatBytes(value: number | null | undefined) {
  if (value == null) {
    return "-";
  }

  if (value < 1024) {
    return `${Math.round(value)} B`;
  }

  return `${(value / 1024).toFixed(1)} KB`;
}

function formatCls(value: number | null) {
  return value == null ? "-" : value.toFixed(3);
}

function topUnusedJavascript(report: LighthouseReport) {
  return getAuditItems(report, "unused-javascript")
    .map((item) => ({
      url: typeof item.url === "string" ? item.url : "unknown",
      totalBytes: typeof item.totalBytes === "number" ? item.totalBytes : 0,
      wastedBytes: typeof item.wastedBytes === "number" ? item.wastedBytes : 0,
    }))
    .sort((left, right) => right.wastedBytes - left.wastedBytes)
    .slice(0, 5);
}

function mainThreadBreakdown(report: LighthouseReport) {
  return getAuditItems(report, "mainthread-work-breakdown")
    .map((item) => ({
      groupLabel: typeof item.groupLabel === "string" ? item.groupLabel : "unknown",
      duration: typeof item.duration === "number" ? item.duration : 0,
    }))
    .sort((left, right) => right.duration - left.duration)
    .slice(0, 5);
}

function topScripts(report: LighthouseReport) {
  return flattenTree(getTreeNodes(report))
    .map((item) => ({
      name: typeof item.name === "string" ? item.name : "unknown",
      resourceBytes: typeof item.resourceBytes === "number" ? item.resourceBytes : 0,
      unusedBytes: typeof item.unusedBytes === "number" ? item.unusedBytes : 0,
    }))
    .sort((left, right) => right.resourceBytes - left.resourceBytes)
    .slice(0, 8);
}

function sharedScripts(reportMap: Array<{ label: string; scripts: ReturnType<typeof topScripts> }>) {
  const counter = new Map<string, { pages: Set<string>; resourceBytes: number; unusedBytes: number }>();

  for (const page of reportMap) {
    for (const script of page.scripts) {
      const current = counter.get(script.name) ?? {
        pages: new Set<string>(),
        resourceBytes: script.resourceBytes,
        unusedBytes: script.unusedBytes,
      };

      current.pages.add(page.label);
      current.resourceBytes = Math.max(current.resourceBytes, script.resourceBytes);
      current.unusedBytes = Math.max(current.unusedBytes, script.unusedBytes);
      counter.set(script.name, current);
    }
  }

  return [...counter.entries()]
    .map(([name, value]) => ({
      name,
      pages: [...value.pages],
      resourceBytes: value.resourceBytes,
      unusedBytes: value.unusedBytes,
    }))
    .filter((item) => item.pages.length > 1)
    .sort((left, right) => right.resourceBytes - left.resourceBytes)
    .slice(0, 10);
}

function render() {
  const pages = REPORTS.map((page) => {
    const report = readReport(page.path);

    return {
      ...page,
      report,
      score: report.categories?.performance?.score ?? null,
      fcp: getMetric(report, "first-contentful-paint"),
      lcp: getMetric(report, "largest-contentful-paint"),
      tbt: getMetric(report, "total-blocking-time"),
      tti: getMetric(report, "interactive"),
      cls: getMetric(report, "cumulative-layout-shift"),
      unused: topUnusedJavascript(report),
      mainThread: mainThreadBreakdown(report),
      scripts: topScripts(report),
    };
  });

  const lines: string[] = [];

  lines.push("# Lighthouse Attribution Summary");
  lines.push("");
  lines.push("## Metrics");
  lines.push("");
  lines.push("| Page | Score | FCP | LCP | TBT | TTI | CLS |");
  lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: |");

  for (const page of pages) {
    lines.push(
      `| \`${page.route}\` | ${formatScore(page.score)} | ${formatMs(page.fcp)} | ${formatMs(page.lcp)} | ${formatMs(page.tbt)} | ${formatMs(page.tti)} | ${formatCls(page.cls)} |`,
    );
  }

  lines.push("");
  lines.push("## Shared Script Hotspots");
  lines.push("");
  lines.push("| Script | Pages | Bytes | Unused |");
  lines.push("| --- | --- | ---: | ---: |");

  for (const script of sharedScripts(pages)) {
    lines.push(
      `| \`${script.name}\` | ${script.pages.join(", ")} | ${formatBytes(script.resourceBytes)} | ${formatBytes(script.unusedBytes)} |`,
    );
  }

  for (const page of pages) {
    lines.push("");
    lines.push(`## ${page.label}`);
    lines.push("");
    lines.push("### Top Unused JavaScript");
    lines.push("");
    lines.push("| Resource | Wasted | Total |");
    lines.push("| --- | ---: | ---: |");

    for (const item of page.unused) {
      lines.push(`| \`${item.url}\` | ${formatBytes(item.wastedBytes)} | ${formatBytes(item.totalBytes)} |`);
    }

    lines.push("");
    lines.push("### Main Thread Breakdown");
    lines.push("");
    lines.push("| Category | Duration |");
    lines.push("| --- | ---: |");

    for (const item of page.mainThread) {
      lines.push(`| ${item.groupLabel} | ${formatMs(item.duration)} |`);
    }
  }

  return lines.join("\n");
}

const markdown = render();
fs.writeFileSync(OUTPUT_PATH, markdown);
console.log(`Wrote ${path.relative(process.cwd(), OUTPUT_PATH)}`);
