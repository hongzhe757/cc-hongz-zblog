# cc-hongz-zblog

Astro + Markdown 个人博客，GitHub Pages 托管。

| 项 | 值 |
| --- | --- |
| 仓库 | https://github.com/hongzhe757/cc-hongz-zblog |
| 线上 | https://blog.hongz.cc |
| 文章目录 | `src/content/blog/*.md` |

## 本地开发

需要 Node **≥ 22.23.4**（推荐 24）：

```bash
npm install
npm run dev
```

## 写文章

1. 在 `src/content/blog/` 新建 `xxx.md`
2. 填写 frontmatter：`title` / `description` / `pubDate`
3. 写 Markdown 正文
4. `git push`（上线推 `main`）

## DNSPod 域名解析（blog.hongz.cc）

| 记录类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| CNAME | `blog` | `hongzhe757.github.io` |

说明：不要填 `https://`，不要填路径；TTL 默认即可。生效后到 GitHub 仓库 **Settings → Pages** 确认 Custom domain 为 `blog.hongz.cc`，并勾选 **Enforce HTTPS**。

## 发布说明

- 开发分支：`dev`
- 线上发布：推送 `main` → GitHub Actions 构建部署
- `public/CNAME` 已写入 `blog.hongz.cc`
