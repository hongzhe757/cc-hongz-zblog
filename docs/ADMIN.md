# 发文说明

> 线上 Vercel Keystatic（`/keystatic` + GitHub 登录）目前会 **500**：缺少可用的 GitHub App Client ID/Secret。  
> 读者站是 GitHub Pages 静态站，**没有** `/keystatic` 路由。

## 推荐：站点发文页（已上线）

打开 https://blog.hongz.cc/write/

1. 填写标题 / 摘要 / 正文  
2. 点「复制 Markdown」  
3. 点「打开 GitHub 新建」→ 粘贴 → Commit 到 `main`  
4. 等 Actions 部署后文章出现在 https://blog.hongz.cc/blog/

## 本机图形后台（Keystatic local）

```bat
npm run admin
```

浏览器打开 http://127.0.0.1:4321/keystatic ，保存后：

```bat
git add src/content/blog
git commit -m "docs: add post"
git push origin main
```

## 若仍要修 Vercel Keystatic

需要先创建 GitHub App，并把下列变量填进 Vercel 后 Redeploy：

- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET`
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
- `PUBLIC_KEYSTATIC_STORAGE=github`
- `KEYSTATIC_ADMIN=1`
- `KEYSTATIC_SECRET`（随机长串）

App Callback：

- `https://cc-hongz-zblog.vercel.app/api/keystatic/github/oauth/callback`
- `http://127.0.0.1:4321/api/keystatic/github/oauth/callback`

在修好之前，请用上面的 `/write` 或本地 Keystatic。
