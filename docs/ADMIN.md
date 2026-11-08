# 发文后台

| 用途 | 地址 |
| --- | --- |
| 读者站 | https://blog.hongz.cc |
| 发文后台 | https://cc-hongz-zblog.vercel.app/keystatic |

## 一次性：创建 GitHub App（必须）

线上登录会调 GitHub，需要先建 App 并把密钥填进 Vercel。

1. 打开 https://github.com/settings/apps/new （若提示邮箱验证，先完成）
2. 填写：

| 字段 | 值 |
| --- | --- |
| GitHub App name | `hongz-zblog-cms`（不可重复，可改） |
| Homepage URL | `https://cc-hongz-zblog.vercel.app/keystatic` |
| Callback URL | `https://cc-hongz-zblog.vercel.app/api/keystatic/github/oauth/callback` |
| 再加一条 Callback | `http://127.0.0.1:4321/api/keystatic/github/oauth/callback` |
| Webhook | 关闭 Active |
| Repository permissions → Contents | Read and write |
| Repository permissions → Metadata | Read-only |
| Repository permissions → Pull requests | Read-only |
| Request user authorization (OAuth) during installation | 勾选 |

3. Create → **Generate a new client secret**（立刻复制）
4. 记下：
   - Client ID → `KEYSTATIC_GITHUB_CLIENT_ID`
   - Client secret → `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - App 名称 slug（URL 里那段）→ `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
5. Install App → Only select `hongzhe757/cc-hongz-zblog`
6. Vercel → Project `cc-hongz-zblog` → Settings → Environment Variables 添加上面 3 个（Production + Preview）
7. Redeploy：`npx vercel --prod` 或在 Dashboard 点 Redeploy

已有变量：`PUBLIC_KEYSTATIC_STORAGE=github`、`KEYSTATIC_ADMIN=1`、`KEYSTATIC_SECRET=...`

## 日常发文

1. 打开 https://cc-hongz-zblog.vercel.app/keystatic
2. Log in with GitHub
3. 博客文章 → Add → Save（会 commit 到仓库）
4. 等 GitHub Actions 部署后，https://blog.hongz.cc 可见

## 本地

```bat
npm run dev
```

http://127.0.0.1:4321/keystatic （local 模式可直接写文件再 git push）
