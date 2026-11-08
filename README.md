# cc-hongz-zblog

个人技术博客（纯静态），GitHub Pages 托管。

| 项 | 值 |
| --- | --- |
| GitHub | https://github.com/hongzhe757/cc-hongz-zblog |
| Pages | https://hongzhe757.github.io/cc-hongz-zblog/ |
| 自定义域名 | https://blog.hongz.cc |

技术选型：**纯静态 HTML**（零构建、直推即可上线；后续可再迁 Hugo/Astro）。

## 本地预览

```bash
python -m http.server 8080
# 打开 http://127.0.0.1:8080/
```

## 写文章

1. 复制 `posts/_template.html` 为新文件。
2. 在 `index.html` 文章列表加链接。
3. `git add . && git commit -m "..." && git push`

## 自定义域名 DNS

在 `hongz.cc` 域名解析中添加：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| CNAME | `blog` | `hongzhe757.github.io` |

仓库根目录已有 `CNAME` 文件（内容：`blog.hongz.cc`）。DNS 生效后，在仓库 **Settings → Pages** 确认 Custom domain 为 `blog.hongz.cc` 并勾选 HTTPS。
