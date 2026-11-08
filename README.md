# cc-hongz-zblog

Astro + Markdown 个人博客，GitHub Pages 托管。

| 项 | 值 |
| --- | --- |
| 仓库 | https://github.com/hongzhe757/cc-hongz-zblog |
| 线上 | https://blog.hongz.cc |
| 文章目录 | `src/content/blog/*.md` |
| 开发分支 | `dev` |
| 发布分支 | `main`（推送后 Actions 自动部署） |

---

## 一、快速启动本地（看效果）

需要 Node **≥ 22.23.4**（推荐 scoop 的 `nodejs24`）。

### 方式 A：一键脚本（推荐）

双击或在仓库根目录执行：

```bat
start-dev.bat
```

脚本会：选用 Node 24 → 必要时 `npm install` → 打开浏览器 → 启动开发服务。

本地地址：**http://127.0.0.1:4321/**

### 方式 B：手动命令

```bat
cd /d D:\workspace\code_workspace\code_misrui\cc-hongz-parent\cc-hongz-zblog

:: 若默认 node 太旧，先把 Node 24 放到 PATH 前面
set PATH=%USERPROFILE%\scoop\apps\nodejs24\current;%PATH%

npm install
npm run dev -- --host 127.0.0.1 --port 4321
```

浏览器打开 http://127.0.0.1:4321/ 。改 Markdown 后页面一般会自动刷新。

停止：在运行 `npm run dev` 的终端按 `Ctrl+C`。

---

## 二、怎么写博客

1. 在 `src/content/blog/` 新建文件，例如 `my-topic.md`（也可用 `.mdx`）。
2. 文件开头写 frontmatter（必填）：

```md
---
title: '文章标题'
description: '一句话摘要'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

正文从这里开始，支持普通 Markdown。
```

3. 保存后本地预览会自动出现在首页 / Blog 列表（无需再改 `index.html`）。
4. 可选封面：把图片放进 `src/assets/`，在 `heroImage` 里引用。
5. 参考示例：
   - `src/content/blog/hello-zblog.md`
   - `src/content/blog/markdown-style-guide.md`

---

## 三、提交与推送（上线）

日常在 **`dev`** 上改，确认没问题再合并到 **`main`** 发布。

### 1）保存到开发分支

```bat
cd /d D:\workspace\code_workspace\code_misrui\cc-hongz-parent\cc-hongz-zblog
git checkout dev
git add .
git commit -m "docs: 新增一篇博文"
git push origin dev
```

### 2）发布到线上（Pages）

```bat
git checkout main
git merge dev
git push origin main
git checkout dev
```

推送 `main` 后，GitHub Actions（`.github/workflows/deploy.yml`）会自动构建并部署。  
几分钟后访问：https://blog.hongz.cc

> 说明：首次推送含 workflow 文件时，本机 `gh` 需要有 `workflow` 权限（`gh auth refresh -h github.com -s workflow`）。

### 常用自检

```bat
npm run build
npm run preview
```

`build` 成功说明线上构建一般也能过。

---

## 四、DNSPod 域名解析（blog.hongz.cc）

| 记录类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| CNAME | `blog` | `hongzhe757.github.io` |

不要填 `https://`，不要填路径；TTL 默认即可。  
生效后到仓库 **Settings → Pages** 确认 Custom domain 为 `blog.hongz.cc`，并勾选 **Enforce HTTPS**。  
`public/CNAME` 已写入 `blog.hongz.cc`，勿随意删除。  
证书未签发前 HTTPS 开关会灰掉，属正常；DNS 正确后等几分钟到几小时再勾。

---

## 五、主题与插件

当前主题：墨绿点缀 + 浅色/深色切换、卡片式文章列表、粘性导航。

已集成：

| 插件/能力 | 说明 |
| --- | --- |
| Tailwind CSS v4 | 布局与组件样式 |
| MDX / Sitemap / RSS | Astro 官方集成 |
| Giscus | 文章评论，**用 GitHub 登录** |

### 开通 Giscus（评论登录）

1. 仓库已开启 **Discussions**
2. 打开 https://giscus.app/zh → 用 GitHub 登录 → 选择仓库 `hongzhe757/cc-hongz-zblog`
3. 安装 **Giscus** GitHub App 到该仓库（页面会提示）
4. `src/consts.ts` 里 `GISCUS.repoId` / `categoryId` 已预填；若你改了分类，按 giscus 页面重新复制即可

---

## 六、父仓位置

本仓库作为子模块挂在：

`D:\workspace\code_workspace\code_misrui\cc-hongz-parent\cc-hongz-zblog`
