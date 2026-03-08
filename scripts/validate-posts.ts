import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  author: z.string().optional(),
  draft: z.boolean().optional(),
});

const POSTS_PATH = path.join(process.cwd(), "content/posts");

function validatePosts() {
  if (!fs.existsSync(POSTS_PATH)) {
    console.warn("Post directory not found.");
    return;
  }

  const files = fs.readdirSync(POSTS_PATH).filter((f) => f.endsWith(".mdx"));
  let hasError = false;

  console.log(`Checking ${files.length} posts...`);

  files.forEach((file) => {
    const fullPath = path.join(POSTS_PATH, file);
    const content = fs.readFileSync(fullPath, "utf-8");

    try {
      const { data } = matter(content);
      postSchema.parse(data);
    } catch (error) {
      hasError = true;
      console.error(`\n[ERROR] In file: ${file}`);
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          console.error(` - ${err.path.join(".")}: ${err.message}`);
        });
      } else if (error instanceof Error) {
        console.error(` - ${error.message}`);
      } else {
        console.error(" - Unknown validation error");
      }
    }
  });

  if (hasError) {
    process.exit(1);
  } else {
    console.log("\nAll posts are valid!");
  }
}

validatePosts();
