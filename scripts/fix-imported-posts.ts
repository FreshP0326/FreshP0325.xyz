import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_PATH = path.join(process.cwd(), "content/posts");
const SOURCE_DIR = "G:\\Python Script\\Bilibili_Markdown\\Bilibili_UP_6993889";

/**
 * 转换标题为安全的 URL slug
 */
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "")
    .replace(/--+/g, "-")
    .slice(0, 50);
}

/**
 * 深度清洗内容，解决 MDX 编译错误
 */
function deepCleanContent(content: string): string {
  let cleaned = content;

  // 1. 处理 Bilibili JSON 噪声 (Quill Delta)
  if (cleaned.trim().startsWith('{"ops":')) {
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed.ops && Array.isArray(parsed.ops)) {
        cleaned = parsed.ops.map((op: any) => typeof op.insert === 'string' ? op.insert : '').join("");
      }
    } catch (e) {
      cleaned = "```json\n" + cleaned + "\n```";
    }
  }

  // 2. 修复裸 URL (<https://...> -> link)
  // 这是导致 esbuild 报错 "Unexpected character /" 的罪魁祸首
  cleaned = cleaned.replace(/<((https?|www)\:\/\/[^>]+)>/g, "[$1]($1)");

  // 3. 处理其他尖括号文本 (<www.example.com>)
  cleaned = cleaned.replace(/<(www\.[^>]+)>/g, "[$1](http://$1)");

  // 4. 转义 MDX 敏感字符 {}，避免 acorn 报错
  cleaned = cleaned.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");

  return cleaned;
}

function fullImportAndFix() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error("Source directory not found!");
    return;
  }

  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith(".md"));
  console.log(`Targeting ${files.length} source files.`);

  let successCount = 0;

  files.forEach((file) => {
    try {
      const sourcePath = path.join(SOURCE_DIR, file);
      const rawContent = fs.readFileSync(sourcePath, "utf-8");
      const { data, content: body } = matter(rawContent);

      let date = data.date || "";
      let originalTitle = data.title || "";

      // 提取 YYYY-MM-DD
      const match = file.match(/^(\d{4}-\d{2}-\d{2})_(.*)\.md$/);
      let yearMonth = "";
      if (match && match[1]) {
        date = date || match[1];
        originalTitle = originalTitle || match[2];
        const dateParts = match[1].split("-");
        yearMonth = `${dateParts[0]}_${dateParts[1]}`;
      } else {
        originalTitle = originalTitle || file.replace(/\.md$/, "");
        date = date || new Date().toISOString().split('T')[0];
        const dateParts = date.split("-");
        yearMonth = `${dateParts[0]}_${dateParts[1]}`;
      }

      // 根据要求重命名为 YYYY_MM_slug.mdx
      const safeSlug = slugify(originalTitle);
      const newFileName = `${yearMonth}_${safeSlug}.mdx`;
      const targetPath = path.join(POSTS_PATH, newFileName);

      const cleanedBody = deepCleanContent(body);

      const newData = {
        title: originalTitle,
        date: date,
        summary: data.summary || cleanedBody.slice(0, 150).replace(/\n/g, " ").trim() + "...",
        author: data.author || "Your Name",
        draft: false,
        categories: data.categories || ["Bilibili"],
        tags: data.tags || [],
      };

      const newFileContent = matter.stringify(cleanedBody, newData);
      fs.writeFileSync(targetPath, newFileContent);
      successCount++;
      console.log(`[OK] ${newFileName}`);
    } catch (err) {
      console.error(`[ERR] ${file}:`, err);
    }
  });

  console.log(`\nImport completed: ${successCount} articles imported.`);
}

function cleanupAll() {
  console.log("Cleaning posts directory...");
  if (!fs.existsSync(POSTS_PATH)) fs.mkdirSync(POSTS_PATH, { recursive: true });
  const files = fs.readdirSync(POSTS_PATH);
  files.forEach(file => {
    if (file.endsWith(".mdx") || file.endsWith(".md")) {
      fs.unlinkSync(path.join(POSTS_PATH, file));
    }
  });
}

cleanupAll();
fullImportAndFix();
