import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IMAGES_DIR = path.join(process.cwd(), "public/images/posts");
const POSTS_DIR = path.join(process.cwd(), "content/posts");
const MIN_BYTES_TO_OPTIMIZE = 400 * 1024;
const WARN_BYTES = 400 * 1024;
const MAX_BYTES = 1024 * 1024;
const MAX_EDGE = 2200;
const MAX_WEBP_EDGE = 1600;
const MAX_HEAVY_WEBP_EDGE = 1400;
const MIN_SAVINGS_BYTES = 8 * 1024;

function formatBytes(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function replaceImageReference(oldName: string, newName: string) {
  const files = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith(".mdx"));
  const oldRef = `/images/posts/${oldName}`;
  const newRef = `/images/posts/${newName}`;

  for (const file of files) {
    const fullPath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(fullPath, "utf8");

    if (!content.includes(oldRef)) {
      continue;
    }

    fs.writeFileSync(fullPath, content.split(oldRef).join(newRef));
  }
}

function sleep(ms: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function replaceFileSafely(targetPath: string, output: Buffer) {
  const tempPath = `${targetPath}.tmp`;
  fs.writeFileSync(tempPath, output);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      fs.rmSync(targetPath, { force: true });
      fs.renameSync(tempPath, targetPath);
      return;
    } catch {
      try {
        fs.copyFileSync(tempPath, targetPath);
        fs.rmSync(tempPath, { force: true });
        return;
      } catch (copyError) {
        if (attempt === 4) {
          throw copyError;
        }

        sleep(250);
      }
    }
  }
}

async function convertOversizedImageToWebp(filePath: string) {
  const stat = fs.statSync(filePath);
  const extension = path.extname(filePath).toLowerCase();

  if (![".png", ".jpg", ".jpeg", ".gif"].includes(extension) || stat.size <= WARN_BYTES) {
    return { changed: false, saved: 0 };
  }

  const baseName = path.basename(filePath, extension);
  const nextFileName = `${baseName}.webp`;
  const nextPath = path.join(IMAGES_DIR, nextFileName);
  const output = await sharp(filePath, { animated: extension === ".gif" })
    .rotate()
    .resize({
      width: MAX_WEBP_EDGE,
      height: MAX_WEBP_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 72, effort: 6 })
    .toBuffer();

  const saved = stat.size - output.length;

  if (saved < MIN_SAVINGS_BYTES && output.length > WARN_BYTES) {
    return { changed: false, saved: 0 };
  }

  fs.writeFileSync(nextPath, output);
  replaceImageReference(path.basename(filePath), nextFileName);

  return { changed: true, saved };
}

async function optimizeImage(filePath: string) {
  const stat = fs.statSync(filePath);
  const extension = path.extname(filePath).toLowerCase();

  if (![".png", ".jpg", ".jpeg", ".webp"].includes(extension)) {
    return { changed: false, saved: 0 };
  }

  const instance = sharp(filePath, { animated: extension === ".webp" });
  const metadata = await instance.metadata();
  const maxEdge = extension === ".webp" && stat.size > WARN_BYTES ? MAX_HEAVY_WEBP_EDGE : MAX_EDGE;
  const shouldResize = (metadata.width ?? 0) > maxEdge || (metadata.height ?? 0) > maxEdge;
  const isAnimated = (metadata.pages ?? 1) > 1;

  if (stat.size < MIN_BYTES_TO_OPTIMIZE && !shouldResize) {
    return { changed: false, saved: 0 };
  }

  let pipeline = sharp(filePath, { animated: isAnimated }).rotate();

  if (shouldResize) {
    pipeline = pipeline.resize({
      width: maxEdge,
      height: maxEdge,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (extension === ".png") {
    pipeline = pipeline.png({
      compressionLevel: 9,
      palette: true,
      quality: 80,
      effort: 10,
    });
  } else if (extension === ".webp") {
    pipeline = pipeline.webp({
      quality: isAnimated ? 42 : stat.size > WARN_BYTES ? 52 : 74,
      effort: 6,
    });
  } else {
    pipeline = pipeline.jpeg({
      quality: 82,
      mozjpeg: true,
      progressive: true,
    });
  }

  const output = await pipeline.toBuffer();
  const saved = stat.size - output.length;

  if (saved < MIN_SAVINGS_BYTES) {
    return { changed: false, saved: 0 };
  }

  replaceFileSafely(filePath, output);

  return { changed: true, saved };
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error("Image directory not found: public/images/posts");
    process.exit(1);
  }

  const imagePaths = fs.readdirSync(IMAGES_DIR)
    .map((file) => path.join(IMAGES_DIR, file))
    .filter((fullPath) => fs.statSync(fullPath).isFile());

  let optimizedCount = 0;
  let totalSaved = 0;
  let convertedCount = 0;

  for (const imagePath of imagePaths) {
    const before = fs.statSync(imagePath).size;
    let result: { changed: boolean; saved: number };

    try {
      result = await optimizeImage(imagePath);
    } catch (error) {
      console.error(`Failed to optimize ${path.basename(imagePath)}: ${error instanceof Error ? error.message : "unknown error"}`);
      continue;
    }

    if (!result.changed) {
      continue;
    }

    optimizedCount += 1;
    totalSaved += result.saved;

    const after = fs.statSync(imagePath).size;
    console.log(`${path.basename(imagePath)}: ${formatBytes(before)} -> ${formatBytes(after)}`);
  }

  for (const imagePath of imagePaths) {
    const before = fs.statSync(imagePath).size;
    let result: { changed: boolean; saved: number };

    try {
      result = await convertOversizedImageToWebp(imagePath);
    } catch (error) {
      console.error(`Failed to convert ${path.basename(imagePath)} to WebP: ${error instanceof Error ? error.message : "unknown error"}`);
      continue;
    }

    if (!result.changed) {
      continue;
    }

    convertedCount += 1;
    totalSaved += result.saved;

    const webpPath = path.join(IMAGES_DIR, `${path.basename(imagePath, path.extname(imagePath))}.webp`);
    const after = fs.statSync(webpPath).size;
    console.log(`${path.basename(imagePath)} -> ${path.basename(webpPath)}: ${formatBytes(before)} -> ${formatBytes(after)}`);
  }

  console.log(`Optimized ${optimizedCount} image(s), converted ${convertedCount} image(s) to WebP, saved ${formatBytes(totalSaved)}.`);
}

void main();
