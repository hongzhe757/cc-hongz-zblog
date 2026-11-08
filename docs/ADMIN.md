# 线上发文后台（Vercel）

读者站：https://blog.hongz.cc（GitHub Pages）  
发文后台：Vercel 上的 `/keystatic`（需 Node）

## 一次性开通

1. 打开 https://vercel.com/new ，用 **GitHub** 登录
2. Import 仓库 `hongzhe757/cc-hongz-zblog`，Framework 选 Astro，Branch 选 `main`
3. Environment Variables 先加：

| Name | Value |
| --- | --- |
| `PUBLIC_KEYSTATIC_STORAGE` | `github` |
| `KEYSTATIC_ADMIN` | `1` |
| `KEYSTATIC_SECRET` | 随机长字符串（可用 `openssl rand -hex 32`） |

4. Deploy
5. 打开 `https://你的项目.vercel.app/keystatic` → **Log in with GitHub** → 按向导创建 GitHub App 并授权本仓库
6. 把页面生成的 `KEYSTATIC_GITHUB_CLIENT_ID` / `CLIENT_SECRET` / `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` 补进 Vercel 环境变量 → Redeploy

## 日常发文

1. 打开后台 `/keystatic`，GitHub 登录
2. 博客文章 → Add → 写完 Save（会 commit 到仓库）
3. 等 Pages Actions 完成后，https://blog.hongz.cc 就能看到

## 本地

```bat
npm run dev
```

打开 http://127.0.0.1:4321/keystatic（无需登录，直接写本地文件再 git push）
