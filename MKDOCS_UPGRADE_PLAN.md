# MkDocs Material 功能实现计划

参考 [MkDocs Material Reference](https://squidfunk.github.io/mkdocs-material/reference/)，我们将为 Black201 博客实现以下增强的 Markdown 功能。

## 1. Admonitions (警告块) 增强
实现全套警告块功能，支持自定义标题和折叠。

### 支持类型 (12+)
- `note`, `abstract`, `info`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`

### 语法支持
- **标准**: `> [!info]`
- **自定义标题**: `> [!info] "自定义标题"`
- **无标题**: `> [!info] ""`
- **可折叠 (默认展开)**: `> [!info]+`
- **可折叠 (默认折叠)**: `> [!info]-`

## 2. Content Tabs (内容选项卡)
允许在同一区域切换不同内容。

### 语法示例
```markdown
=== "Tab 1"
    内容 1
=== "Tab 2"
    内容 2
```

## 3. Footnotes (脚注)
支持文档内的参考引用。

### 语法示例
```markdown
这是一个引用[^1]。

[^1]: 这是脚注的详细说明。
```

## 4. Task Lists (任务列表)
美化任务列表样式。

### 语法示例
```markdown
- [x] 已完成任务
- [ ] 未完成任务
```

## 5. Data Tables (增强表格)
- 支持单元格内换行和复杂 MDX。
- 响应式横向滚动优化。

## 6. Abbreviations (缩写)
支持鼠标悬停显示缩写全称。

### 语法示例
```markdown
*[HTML]: Hyper Text Markup Language
```

---

## 技术实现路径

1.  **解析层 (`content-collections.ts`)**:
    - 确保 `remark-gfm` 已启用。
    - 考虑引入 `remark-callouts` 或自定义正则解析器。
2.  **渲染层 (`src/components/blog/mdx-components.tsx`)**:
    - 重构 `Admonition` 组件，使用 `details` / `summary` 实现折叠。
    - 实现 `Tabs` 和 `Tab` 组件。
3.  **样式层 (`src/styles/globals.css`)**:
    - 定义每种 Admonition 类型的颜色变量。
    - 添加折叠动画和选项卡切换样式。
