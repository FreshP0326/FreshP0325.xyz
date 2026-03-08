/**
 * Batch-fix common Markdown formatting issues in blog posts.
 * Usage: `npx tsx scripts/optimize-posts.ts`
 */

import fs from "node:fs";
import path from "node:path";

const postsDir = path.join(process.cwd(), "content/posts");
const posts = fs.readdirSync(postsDir).filter((file) => file.endsWith(".mdx"));

console.log(`Found ${posts.length} posts to optimize\n`);

let totalFixed = 0;

for (const post of posts) {
  const filePath = path.join(postsDir, post);
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;
  const fixes: string[] = [];

  const emptyHeadingMatch = content.match(/^##\s*$/gm);
  if (emptyHeadingMatch) {
    content = content.replace(/^##\s*$/gm, "");
    fixes.push("removed empty headings");
    modified = true;
  }

  const headingNoSpaceMatch = content.match(/^(#{1,6}\s+.+)\n([^\n])/gm);
  if (headingNoSpaceMatch) {
    content = content.replace(/^(#{1,6}\s+.+)\n([^\n])/gm, "$1\n\n$2");
    fixes.push("added blank lines after headings");
    modified = true;
  }

  const multipleEmptyLinesMatch = content.match(/\n{3,}/g);
  if (multipleEmptyLinesMatch) {
    content = content.replace(/\n{3,}/g, "\n\n");
    fixes.push("collapsed extra empty lines");
    modified = true;
  }

  if (content.includes("\\_")) {
    content = content.replace(/\\_/g, "_");
    fixes.push("fixed escaped underscores");
    modified = true;
  }

  if (content.endsWith("\n\n")) {
    content = content.replace(/\n+$/, "\n");
    fixes.push("normalized trailing newline");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✓ ${post}: ${fixes.join(", ")}`);
    totalFixed++;
  }
}

console.log(`\nOptimization complete. Updated ${totalFixed} posts.`);
