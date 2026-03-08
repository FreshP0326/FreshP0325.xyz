import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const IMAGES_DIR = path.join(process.cwd(), "public/images/posts");
const WARN_BYTES = 400 * 1024;
const MAX_BYTES = 1024 * 1024;
const MAX_WIDTH = 3840;
const MAX_HEIGHT = 3840;
const IMAGE_REF_PATTERN = /\/images\/posts\/([^\s)"']+)/g;

type ValidationIssue = {
  level: "warn" | "error";
  message: string;
};

function collectPostReferences() {
  const references = new Set<string>();
  const files = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith(".mdx"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const matches = content.matchAll(IMAGE_REF_PATTERN);

    for (const match of matches) {
      if (match[1]) {
        references.add(match[1]);
      }
    }
  }

  return references;
}

async function validate() {
  const referencedImages = collectPostReferences();
  const issues: ValidationIssue[] = [];

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error("Image directory not found: public/images/posts");
    process.exit(1);
  }

  for (const imageName of referencedImages) {
    const fullPath = path.join(IMAGES_DIR, imageName);

    if (!fs.existsSync(fullPath)) {
      issues.push({ level: "error", message: `Missing referenced image: ${imageName}` });
      continue;
    }

    const stat = fs.statSync(fullPath);
    if (stat.size > MAX_BYTES) {
      issues.push({ level: "error", message: `Image exceeds 1 MB: ${imageName} (${Math.round(stat.size / 1024)} KB)` });
    } else if (stat.size > WARN_BYTES) {
      issues.push({ level: "warn", message: `Image exceeds 400 KB: ${imageName} (${Math.round(stat.size / 1024)} KB)` });
    }

    try {
      const metadata = await sharp(fullPath).metadata();
      if ((metadata.width ?? 0) > MAX_WIDTH || (metadata.height ?? 0) > MAX_HEIGHT) {
        issues.push({
          level: "warn",
          message: `Image dimensions exceed ${MAX_WIDTH}x${MAX_HEIGHT}: ${imageName} (${metadata.width}x${metadata.height})`,
        });
      }
    } catch (error) {
      issues.push({
        level: "error",
        message: `Unable to inspect image metadata: ${imageName} (${error instanceof Error ? error.message : "unknown error"})`,
      });
    }
  }

  const warnings = issues.filter((issue) => issue.level === "warn");
  const errors = issues.filter((issue) => issue.level === "error");

  console.log(`Checked ${referencedImages.size} referenced post images.`);

  for (const warning of warnings) {
    console.warn(`[WARN] ${warning.message}`);
  }

  for (const error of errors) {
    console.error(`[ERROR] ${error.message}`);
  }

  if (errors.length > 0) {
    process.exit(1);
  }

  console.log(`Validation complete with ${warnings.length} warning(s).`);
}

void validate();
