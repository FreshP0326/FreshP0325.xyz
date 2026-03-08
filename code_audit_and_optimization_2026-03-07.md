# Code Audit & Optimization Report - 2026-03-07

## 1. Project Overview
The `minimal-blog` project is built with a modern tech stack:
- **Framework**: Next.js 15 (App Router)
- **Content**: Content Collections (MDX)
- **Styling**: Tailwind CSS 4 + Shadcn UI
- **API/DB**: tRPC + Drizzle ORM + Postgres
- **Animation**: Framer Motion

## 2. Identified Issues & Potential Risks

### A. MDX Component Complexity
The `src/components/blog/mdx-components.tsx` file is becoming a "mega-file" containing logic for Admonitions, Tabs, Code blocks, and various element mappings.
- **Risk**: Difficult to maintain, hard to test individual components.
- **Optimization**: Extract `Admonition`, `Tabs`, and `CodeBlock` into a `src/components/blog/mdx/` directory.

### B. Code Block Utility
Current code blocks have syntax highlighting but lack basic developer-friendly features.
- **Improvement**: Add a "Copy Code" button and a "Line Highlighting" indicator.

### C. Large Client Components
Components like `SearchDialog` and `PostInteractions` are imported statically in the main layouts/pages.
- **Risk**: Increases the initial Bundle Size.
- **Optimization**: Use `next/dynamic` for heavy client-side components that are not needed immediately on first paint.

### D. Image Optimization in MDX
While `next/image` is used, the configuration is generic.
- **Optimization**: Allow passing `priority` through MDX or automatically apply it to the first image found in a post.

### E. tRPC Query Efficiency
Review `src/components/blog/post-interactions.tsx` and similar components.
- **Risk**: Repeated fetching of stats on every navigation.
- **Optimization**: Configure `staleTime` and `gcTime` in the Query Client provider for data that doesn't change frequently (like view counts in the short term).

## 3. Recommended Optimization Steps

### Step 1: Component Refactoring (Architecture)
1. Create `src/components/blog/mdx/` directory.
2. Move `Admonition.tsx`, `Tabs.tsx`, and `Pre.tsx` to this directory.
3. Clean up `mdx-components.tsx` to just act as a map.

### Step 2: Code Block Enhancements (UX)
1. Implement a `CopyButton` component.
2. Wrap `pre` content with the `CopyButton`.

### Step 3: Bundle Optimization (Performance)
1. Identify components for dynamic loading.
2. Refactor `src/app/blog/[slug]/page.tsx` to use dynamic imports for interactions.

### Step 4: Schema Refinement (Type Safety)
1. Update `content-collections.ts` to include explicit `content` properties in schemas to remove deprecation warnings.

## 4. Performance Metrics Goal
- **Lighthouse Score**: Maintain 95+ in all categories.
- **Bundle Size**: Reduce main bundle size by ~15% through dynamic imports.

---
*Created by Cline AI - 2026-03-07*
