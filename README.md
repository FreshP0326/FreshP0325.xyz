# FreshP0325.xyz

这是一个基于 Next.js 的静态导出博客，针对 Cloudflare Pages 的低成本部署场景进行了优化。

## 技术栈

- Next.js App Router
- 通过 `content-collections` 使用 MDX
- 使用 `next-intl` 提供 `zh`、`en`、`ja` 多语言
- Tailwind CSS
- 静态资源通过 `public/` 提供

## 运行模式

当前项目以纯静态站点方式部署：

- 输出目录：`out/`
- 不使用数据库
- 不使用 tRPC API
- 不使用基于 middleware 的语言路由
- 不包含评论与阅读量统计

这种方式可以把部署成本压到很低，也更适合在未备案前提下服务中国大陆访客。

## 环境变量

请根据 `.env.example` 创建 `.env`，并设置：

```env
NEXT_PUBLIC_SITE_URL="https://freshp0325.xyz"
```

`NEXT_PUBLIC_SITE_URL` 会用于生成 canonical URL、`robots.txt`、`sitemap.xml` 与 `rss.xml`。

## 本地开发

```bash
npm install
npm run dev
```

开发环境默认访问 `http://localhost:3000/`，当前会重定向到 `http://localhost:3000/zh`。

如果你想直接查看某个语言版本，可以使用：

- `http://localhost:3000/zh`
- `http://localhost:3000/en`
- `http://localhost:3000/ja`

## 校验命令

```bash
npm run validate:posts
npm run validate:images
npm run optimize:images
npm run typecheck
npm run build
```

构建成功后，静态站点会导出到 `out/`。

## 本地预览

```bash
npm run preview
```

该命令会直接预览生成后的 `out/` 目录，而不是运行 `next start`。

如果你要做上线前验收，优先使用 `npm run preview`，因为它更接近 Cloudflare Pages 的实际部署效果。

## 部署目标

推荐的部署平台是 Cloudflare Pages。

- Build command：`npm ci && npm run build`
- Build output directory：`out`
- Node version：`22`
- 必填环境变量：`NEXT_PUBLIC_SITE_URL=https://freshp0325.xyz`

## Cloudflare Pages 相关文件

仓库中已包含：

- `public/_redirects`：用于语言入口与 RSS 重定向
- `public/_headers`：用于静态资源缓存规则

## 性能测试流程

请先生成最新静态构建，再执行可重复的 Lighthouse 流程：

```bash
npm run build
npm run perf:lighthouse
npm run perf:report
```

Lighthouse 脚本会：

- 在端口 `3000` 已被占用时阻止执行
- 检查 `out/` 是否比当前源码更新
- 在独立端口启动静态预览
- 将仅生产环境报告保存到 `reports/lighthouse`
- 输出汇总到 `reports/lighthouse/SUMMARY.md`

如果你只想测试单个页面，也可以运行：

```bash
npm run perf:lighthouse -- /en/blog
```

## 内容工作流

日常写作流程保持不变：

1. 在 Obsidian 或本地编辑器中编写内容
2. 提交并推送到 GitHub
3. 由 Cloudflare Pages 自动构建并发布

## 中国大陆访问说明

- 当前方案不使用中国大陆节点，因为站点在未备案前提下以境外静态站方式部署
- 性能提升主要来自静态导出、激进缓存、资源简化与 Cloudflare 全球边缘网络
- 如果后续完成备案，可以在当前基础上继续增加更适合中国大陆的 CDN 或加速方案
