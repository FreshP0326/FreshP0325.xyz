import GithubSlugger from "github-slugger";

const headingPattern = /^(#{2,3})\s+(.+?)\s*#*\s*$/;
const fencePattern = /^(```|~~~)/;

function stripInlineMarkdown(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\\([\\`*_{}[\]()#+.!-])/g, "$1")
    .trim();
}

export function extractTocItems(content: string) {
  const slugger = new GithubSlugger();
  const items: Array<{ id: string; text: string; level: number }> = [];
  let inFence = false;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (fencePattern.test(line)) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const match = line.match(headingPattern);
    const hashes = match?.[1];
    const rawText = match?.[2];

    if (!hashes || !rawText) {
      continue;
    }

    const text = stripInlineMarkdown(rawText);
    if (!text) {
      continue;
    }

    items.push({
      id: slugger.slug(text),
      text,
      level: hashes.length,
    });
  }

  return items;
}
