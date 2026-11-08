import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { D as addAttribute, b as maybeRenderHead, d as renderComponent, g as renderSlot, p as Fragment, x as renderHead, y as renderTemplate } from "./jsx-runtime_B3hLhILp.mjs";
import { t as createComponent } from "./astro-component_BaA6IVZM.mjs";
import "./compiler_LbqzbmMT.mjs";
import { n as render, t as getCollection } from "./_astro_content_BjKl28YN.mjs";
import { i as createAstro, r as $$Image } from "./_astro_assets_DT738yx5.mjs";
import { n as $$Footer, r as $$BaseHead, t as $$Header } from "./Header_DhSVDWH4.mjs";
import { t as $$FormattedDate } from "./FormattedDate_BMdOrkl6.mjs";
import { r as SITE_LANG, t as GISCUS } from "./consts_BigjK7kT.mjs";
// src/components/Giscus.astro
var $$Giscus = createComponent(($$result, $$props, $$slots) => {
	const ready = Boolean(GISCUS.repoId && GISCUS.categoryId);
	return renderTemplate`${maybeRenderHead($$result)}<section class="mt-12 border-t border-[var(--line)] pt-8"><h2 class="mb-4 text-xl font-bold text-[var(--ink)]">评论</h2>${ready ? renderTemplate`<script src="https://giscus.app/client.js"${addAttribute(GISCUS.repo, "data-repo")}${addAttribute(GISCUS.repoId, "data-repo-id")}${addAttribute(GISCUS.category, "data-category")}${addAttribute(GISCUS.categoryId, "data-category-id")}${addAttribute(GISCUS.mapping, "data-mapping")}${addAttribute(GISCUS.strict, "data-strict")}${addAttribute(GISCUS.reactionsEnabled, "data-reactions-enabled")}${addAttribute(GISCUS.emitMetadata, "data-emit-metadata")}${addAttribute(GISCUS.inputPosition, "data-input-position")}${addAttribute(GISCUS.theme, "data-theme")}${addAttribute(GISCUS.lang, "data-lang")} data-loading="lazy" crossorigin="anonymous" async><\/script>` : renderTemplate`<div class="rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[var(--bg-elevated)] p-5 text-[var(--muted)]"><p class="m-0">评论使用 <strong>Giscus</strong>（GitHub 登录）。请先：</p><ol class="mt-3 mb-0"><li>打开仓库 <strong>Settings → General → Features</strong>，勾选 <code>Discussions</code></li><li>打开${" "}<a href="https://giscus.app/zh" target="_blank" rel="noreferrer">giscus.app/zh</a>，选仓库 <code>${GISCUS.repo}</code>，生成配置</li><li>把 <code>repoId</code> / <code>categoryId</code> 填进${" "}<code>src/consts.ts</code> 的 <code>GISCUS</code></li></ol></div>`}</section>`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/components/Giscus.astro", void 0);
// src/layouts/BlogPost.astro
createAstro("https://example.vercel.app");
var $$BlogPost = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BlogPost;
	const { title, description, pubDate, updatedDate, heroImage } = Astro.props;
	return renderTemplate`<html${addAttribute(SITE_LANG, "lang")}><head>${renderComponent($$result, "BaseHead", $$BaseHead, {
		"title": title,
		"description": description
	})}${renderHead($$result)}</head><body>${renderComponent($$result, "Header", $$Header, {})}<main class="site-shell py-4 sm:py-10"><article>${heroImage && renderTemplate`<div class="panel overflow-hidden !p-0">${renderComponent($$result, "Image", $$Image, {
		"class": "block h-auto w-full",
		"width": 1200,
		"height": 520,
		"src": heroImage,
		"alt": ""
	})}</div>`}<div class="prose-body pt-4 sm:pt-8"><p class="hud-label m-0">LOG · ${renderComponent($$result, "FormattedDate", $$FormattedDate, { "date": pubDate })}${updatedDate && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${" "}/ UPD ${renderComponent($$result, "FormattedDate", $$FormattedDate, { "date": updatedDate })}` })}`}</p><h1 class="mt-2 mb-2 text-xl font-bold tracking-tight text-[var(--ink)] sm:mt-3 sm:mb-4 sm:text-4xl">${title}</h1><p class="mt-0 mb-5 text-sm text-[var(--muted)] sm:mb-8 sm:text-base">${description}</p><hr><div class="prose-body">${renderSlot($$result, $$slots["default"])}</div>${renderComponent($$result, "Giscus", $$Giscus, {})}</div></article></main>${renderComponent($$result, "Footer", $$Footer, {})}</body></html>`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/layouts/BlogPost.astro", void 0);
// src/pages/blog/[...slug].astro
var ____slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Component,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	url: () => $$url
});
createAstro("https://example.vercel.app");
async function getStaticPaths() {
	return (await getCollection("blog")).map((post) => ({
		params: { slug: post.id },
		props: post
	}));
}
var $$Component = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Component;
	const post = Astro.props;
	const { Content } = await render(post);
	return renderTemplate`${renderComponent($$result, "BlogPost", $$BlogPost, { ...post.data }, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Content", Content, {})}` })}`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/pages/blog/[...slug].astro", void 0);
var $$file = "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/pages/blog/[...slug].astro";
var $$url = "/blog/[...slug]";
// \0virtual:astro:page:src/pages/blog/[...slug]@_@astro
var page = () => ____slug__exports;
export { page };
