# Black201 个人网站部署指南（Cloudflare Pages 静态站版）

本指南将原来的 `GitHub + Netlify + 动态 Next.js` 工作流，替换为更适合“免备案、低成本、尽量提升中国大陆访问体验”的 `GitHub + Cloudflare Pages + Cloudflare DNS` 静态站方案。

## 1. 最终方案

- 内容编辑：Obsidian 或本地编辑器
- 代码托管：GitHub
- 站点托管：Cloudflare Pages
- DNS：Cloudflare DNS
- 部署形态：Next.js 静态导出到 `out/`
- 默认语言入口：`/` 跳转到 `/zh/`
- RSS 地址：`/rss.xml`

当前方案已经移除了以下动态能力：

- 评论
- 浏览量统计
- PostgreSQL / Drizzle
- tRPC API
- middleware 语言重写

这样做的目的是把站点彻底变成静态内容站，降低维护成本，并减少跨境动态请求带来的性能波动。

## 2. 为什么这样更适合你

在“不备案”的前提下，无法合法使用中国大陆境内的标准网站接入方案。因此最稳妥的优化方向不是继续保留动态服务，而是：

1. 尽量减少服务端逻辑
2. 将页面预渲染为静态 HTML
3. 让 CSS、JS、图片和 HTML 走全球边缘缓存
4. 把部署流程简化到接近零运维

## 3. 本地准备

### 3.1 环境变量

复制 `.env.example` 为 `.env`，并设置：

```env
NEXT_PUBLIC_SITE_URL="https://你的域名"
```

### 3.2 安装依赖

```bash
npm install
```

### 3.3 本地验证

```bash
npm run validate:posts
npm run validate:images
npm run optimize:images
npm run typecheck
npm run build
```

构建成功后，输出目录应为：

```txt
out/
```

### 3.4 本地静态预览

```bash
npm run preview
```

然后检查以下页面：

- `/`
- `/zh/`
- `/en/`
- `/ja/`
- `/zh/blog/`
- 任意文章页
- `/search-index.json`
- `/rss.xml`
- `/robots.txt`
- `/sitemap.xml`

说明：

- `npm run dev` 适合调试页面和组件
- `npm run preview` 更接近最终上线后的静态站效果
- 现在根路径 `/` 在本地开发和静态预览里都会跳转到 `/zh/`

## 4. Cloudflare Pages 部署

### 4.1 准备独立仓库

建议将 `minimal-blog` 拆成独立 Git 仓库，再连接到 Cloudflare Pages。这样构建根目录最清晰，后续维护最轻松。

### 4.2 创建 Pages 项目

在 Cloudflare Pages 中：

1. 选择 **Workers & Pages**
2. 创建新的 **Pages** 项目
3. 连接 GitHub 仓库
4. 选择你的博客仓库

### 4.3 构建配置

填写以下配置：

- Build command: `npm ci && npm run build`
- Build output directory: `out`
- Root directory: 仓库根目录
- Node.js version: `22`

### 4.4 环境变量

在 Cloudflare Pages 项目中添加：

- `NEXT_PUBLIC_SITE_URL=https://你的正式域名`

## 5. 自定义域名与 DNS

### 5.1 将域名托管到 Cloudflare

1. 在 Cloudflare 添加你的域名
2. Cloudflare 会给出一组 nameservers
3. 到域名注册商后台，将域名 NS 改为 Cloudflare 提供的 nameservers
4. 等待生效

### 5.2 绑定站点域名

在 Pages 项目中添加：

- `你的域名`
- `www.你的域名`

建议：

- 裸域作为主域名
- `www` 301 跳转到裸域

## 6. 本项目内置的 Cloudflare 规则

### 6.1 `_redirects`

仓库自带 `public/_redirects`，用于：

- `/` 跳转到 `/zh/`
- 常见未带语言前缀的路径跳到 `/zh/...`
- `/api/rss` 兼容跳转到 `/rss.xml`

### 6.2 `_headers`

仓库自带 `public/_headers`，用于：

- 长缓存 `/_next/static/*`
- 为图片和站点元数据设置较合理缓存时间

## 7. Obsidian 写作工作流

你原来的内容工作流可以原样保留：

1. 在 `content/` 中写文章、履历和专辑内容
2. 图片放入 `public/images/`
3. 推送 GitHub
4. Cloudflare Pages 自动构建并发布

### 7.1 推荐目录

- 博客文章：`content/posts/`
- 履历：`content/biography.mdx`
- 专辑：`content/discography/`
- 图片：`public/images/`

## 8. 发布前检查清单

每次准备上线前，建议执行：

```bash
npm run validate:posts
npm run validate:images
npm run typecheck
npm run build
```

确认：

- 没有构建报错
- 文章内图片路径正确
- `rss.xml`、`sitemap.xml`、`robots.txt` 都正常生成
- 页面不再出现评论区和浏览量

## 9. 仓库清理建议

以下内容不应提交为长期产物：

- `.next/`
- `out/`
- `.content-collections/`
- `.lh-*`
- `.lighthouse-*.json`
- `.next-start.log`
- `build-output.txt`
- `build-trace.txt`
- `reports/lighthouse/`
- `*.tsbuildinfo`

这些规则已经补充到 `.gitignore`。

## 10. 常见问题

### 10.1 为什么不继续用 Netlify？

因为这个项目现在的目标是：

- 免备案
- 尽量便宜
- 减少动态依赖
- 提高中国大陆访问稳定性

静态站 + Cloudflare Pages 更符合这个目标。

### 10.2 为什么不直接使用中国大陆节点？

因为不备案就不适合直接走中国大陆标准网站接入方案。本方案选择合法、低成本、低运维的折中路径。

### 10.3 以后还能升级吗？

可以。如果你未来愿意备案，可以在现在这套静态站基础上，继续升级中国大陆 CDN 或混合加速方案。

## 11. 推荐上线顺序

1. 本地构建通过
2. 推到 GitHub
3. Pages 使用 `*.pages.dev` 先验证
4. 验证没问题后再绑定正式域名
5. 确认 Cloudflare 域名可用后，再下线旧的 Netlify 站点
