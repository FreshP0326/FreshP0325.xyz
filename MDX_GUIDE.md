# Black201 博客 MDX 使用指南

本指南将教你如何使用 Black201 博客中增强的 MDX 功能，包括 GitHub 风格的警告块、鲜艳的代码高亮以及响应式表格。

## 1. 警告块 (Admonitions)

我们支持两种写法，都会渲染成带图标与颜色区分的提示框：

1) GitHub 风格：`> [!TYPE]`
2) 指令风格：`:::type ... :::`

### 使用示例：

```markdown
> [!NOTE]
> 这是一个提示信息。

> [!TIP]
> 这是一个实用技巧。

> [!IMPORTANT]
> 这是一个重要信息。

> [!WARNING]
> 这是一个警告信息。

> [!CAUTION]
> 这是一个危险警告。

:::note
这是一个 note 提示。
:::

:::tip
这是一个 tip 提示。
:::

:::important
这是一个 important 提示。
:::

:::warning
这是一个 warning 提示。
:::

:::caution
这是一个 caution 提示。
:::
```

---

## 2. 代码高亮 (Code Highlighting)

代码块现在使用 **Tokyo Night** (深色) 和 **Vitesse Light** (浅色) 主题，色彩鲜艳且易于阅读。

### 使用方法：
使用标准的三反引号语法，并指定语言名称。

````markdown
```typescript
const message: string = "Hello World";
console.log(message);
```
````

---

## 3. 响应式表格 (Responsive Tables)

表格现在拥有精致的边框、交替背景色，并且在移动端会自动启用横向滚动。

### 使用方法：
使用标准的 Markdown 表格语法。

```markdown
| 属性 | 描述 | 状态 |
| :--- | :--- | :---: |
| 样式 | 现代极简 | ✅ |
| 响应式 | 自动滚动 | ✅ |
| 字体 | JetBrains Mono | ✅ |
```

---

## 4. 专辑页面 (Discography)

在 `content/discography/` 目录下创建 `.mdx` 文件。

### Frontmatter 模板：
```yaml
---
title: 专辑名称
date: "2024-03-06"
cover: /path/to/cover.jpg
summary: 专辑简介
links:
  - label: Bandcamp
    url: https://...
  - label: dizzylab
    url: https://...
tracks:
  - 曲目 1
  - 曲目 2
---
```

---

## 5. 个人简介 (Biography)

编辑 `content/biography.mdx` 即可更新个人简介页面。你可以自由使用上述所有 MDX 组件。

---

**提示：** 修改 MDX 文件后，Next.js 会自动热更新，你可以立即在浏览器中看到效果。
