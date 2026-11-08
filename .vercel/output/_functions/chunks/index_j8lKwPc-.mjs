import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { D as addAttribute, d as renderComponent, x as renderHead, y as renderTemplate } from "./jsx-runtime_B3hLhILp.mjs";
import { t as createComponent } from "./astro-component_BaA6IVZM.mjs";
import "./compiler_LbqzbmMT.mjs";
import { r as $$Image } from "./_astro_assets_DT738yx5.mjs";
import { t as getCollection } from "./_astro_content_BjKl28YN.mjs";
import { n as $$Footer, r as $$BaseHead, t as $$Header } from "./Header_DhSVDWH4.mjs";
import { t as $$FormattedDate } from "./FormattedDate_BMdOrkl6.mjs";
import { i as SITE_TITLE, n as SITE_DESCRIPTION, r as SITE_LANG } from "./consts_BigjK7kT.mjs";
// src/pages/blog/index.astro
var blog_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const posts = (await getCollection("blog")).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	return renderTemplate`<html${addAttribute(SITE_LANG, "lang")}><head>${renderComponent($$result, "BaseHead", $$BaseHead, {
		"title": `文章 · ${SITE_TITLE}`,
		"description": SITE_DESCRIPTION
	})}${renderHead($$result)}</head><body>${renderComponent($$result, "Header", $$Header, {})}<main class="site-shell py-4 sm:py-12"><header class="panel mb-4 px-3.5 py-4 sm:mb-8 sm:px-6 sm:py-6"><p class="hud-label m-0">Archive / Index</p><h1 class="mt-2 mb-1.5 text-xl font-bold text-[var(--ink)] sm:text-4xl">全部文章</h1><p class="m-0 text-sm text-[var(--muted)]">Markdown → Astro → Pages</p></header><ul class="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:gap-4 md:grid-cols-2">${posts.map((post) => renderTemplate`<li class="card"><a${addAttribute(`/blog/${post.id}/`, "href")} class="block no-underline">${post.data.heroImage && renderTemplate`${renderComponent($$result, "Image", $$Image, {
		"class": "h-36 w-full object-cover sm:h-44",
		"width": 720,
		"height": 360,
		"src": post.data.heroImage,
		"alt": ""
	})}`}<div class="p-3.5 sm:p-5"><p class="mono m-0 text-[0.7rem] text-[var(--accent)] sm:text-xs">${renderComponent($$result, "FormattedDate", $$FormattedDate, { "date": post.data.pubDate })}</p><h2 class="mt-1.5 mb-1.5 text-base font-bold text-[var(--ink)] sm:text-xl">${post.data.title}</h2><p class="m-0 text-sm text-[var(--muted)]">${post.data.description}</p></div></a></li>`)}</ul></main>${renderComponent($$result, "Footer", $$Footer, {})}</body></html>`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/pages/blog/index.astro", void 0);
var $$file = "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/pages/blog/index.astro";
var $$url = "/blog";
// \0virtual:astro:page:src/pages/blog/index@_@astro
var page = () => blog_exports;
export { page };
