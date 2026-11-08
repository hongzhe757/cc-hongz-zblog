import { D as addAttribute, b as maybeRenderHead, d as renderComponent, g as renderSlot, r as spreadAttributes, y as renderTemplate } from "./jsx-runtime_B3hLhILp.mjs";
import { t as createComponent } from "./astro-component_BaA6IVZM.mjs";
import { i as createAstro, n as $$Font } from "./_astro_assets_DT738yx5.mjs";
import { t as createImageAsset } from "./image-asset_C-y4ZSmm.mjs";
import "./compiler_LbqzbmMT.mjs";
import { i as SITE_TITLE } from "./consts_BigjK7kT.mjs";
// src/assets/blog-placeholder-1.jpg
var blog_placeholder_1_default = createImageAsset({
	"src": "/_astro/blog-placeholder-1.Bx0Zcyzv.jpg",
	"width": 960,
	"height": 480,
	"format": "jpg"
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/assets/blog-placeholder-1.jpg", false);
// src/components/ThemeBoot.astro
var $$ThemeBoot = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`<script>
	(function () {
		try {
			const root = document.documentElement;
			const mode = localStorage.getItem('theme') || 'dark';
			const skin = localStorage.getItem('blog-skin') || 'cyber';
			root.classList.toggle('dark', mode === 'dark');
			root.setAttribute('data-skin', skin);
		} catch (_) {}
	})();
<\/script>`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/components/ThemeBoot.astro", void 0);
// src/components/BaseHead.astro
createAstro("https://example.vercel.app");
var $$BaseHead = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseHead;
	const canonicalURL = new URL(Astro.url.pathname, Astro.site);
	const { title, description, image = blog_placeholder_1_default } = Astro.props;
	return renderTemplate`<!-- Global Metadata --><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"><meta name="format-detection" content="telephone=no"><meta name="theme-color" content="#05070d"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><link rel="sitemap" href="/sitemap-index.xml"><link rel="alternate" type="application/rss+xml"${addAttribute(SITE_TITLE, "title")}${addAttribute(new URL("rss.xml", Astro.site), "href")}><meta name="generator"${addAttribute(Astro.generator, "content")}>${renderComponent($$result, "ThemeBoot", $$ThemeBoot, {})}${renderComponent($$result, "Font", $$Font, {
		"cssVariable": "--font-atkinson",
		"preload": true
	})}<!-- Canonical URL --><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Primary Meta Tags --><title>${title}</title><meta name="description"${addAttribute(description, "content")}><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(Astro.url, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(new URL(image.src, Astro.url), "content")}><!-- Twitter --><meta name="twitter:card" content="summary_large_image">`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/components/BaseHead.astro", void 0);
// src/components/Footer.astro
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return renderTemplate`${maybeRenderHead($$result)}<footer class="site-shell mt-10 border-t border-[var(--line)] py-6 sm:mt-16 sm:py-10"><div class="panel px-3.5 py-4 text-center sm:px-6 sm:py-5"><p class="hud-label m-0">EOF</p><p class="mono mt-2 mb-0 text-[0.7rem] text-[var(--muted)] sm:mt-3 sm:text-sm">© ${year} hongz · <a href="https://blog.hongz.cc">blog.hongz.cc</a></p><p class="mono mt-2 mb-0 text-[0.7rem]"><a href="https://github.com/hongzhe757/cc-hongz-zblog" target="_blank" rel="noreferrer">REPO</a><span aria-hidden="true"> // </span><a href="/rss.xml">RSS</a></p></div></footer>`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/components/Footer.astro", void 0);
// src/components/HeaderLink.astro
createAstro("https://example.vercel.app");
var $$HeaderLink = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$HeaderLink;
	const { href, class: className, ...props } = Astro.props;
	const pathname = Astro.url.pathname.replace("/", "");
	const subpath = pathname.match(/[^\/]+/g);
	const isActive = href === pathname || href === "/" + (subpath?.[0] || "");
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute([className, { active: isActive }], "class:list")}${spreadAttributes(props)} data-astro-cid-evkijfd6>${renderSlot($$result, $$slots["default"])}</a>`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/components/HeaderLink.astro", void 0);
// src/components/SkinSettings.astro
var $$SkinSettings = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div class="skin-settings relative" data-astro-cid-fotxufti><button id="skin-settings-btn" type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] text-sm font-semibold text-[var(--ink)] shadow-sm transition hover:border-[var(--accent)] mono sm:w-auto sm:gap-1.5 sm:px-3" aria-haspopup="dialog" aria-expanded="false" aria-controls="skin-settings-panel" title="皮肤设置" data-astro-cid-fotxufti><span aria-hidden="true" data-astro-cid-fotxufti>◐</span><span class="hidden sm:inline" data-astro-cid-fotxufti>皮肤</span></button><div id="skin-settings-panel" class="fixed inset-x-3 top-[3.75rem] z-50 hidden max-h-[min(70vh,28rem)] w-auto overflow-y-auto rounded-[14px] border border-[var(--line)] bg-[var(--bg-elevated)] p-3 shadow-[var(--shadow)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+0.5rem)] sm:max-h-none sm:w-64 sm:overflow-visible" role="dialog" aria-label="皮肤设置" data-astro-cid-fotxufti><p class="m-0 mb-2 text-xs font-semibold tracking-wide text-[var(--muted)] uppercase" data-astro-cid-fotxufti>明暗</p><div class="mb-3 grid grid-cols-2 gap-2" data-astro-cid-fotxufti><button type="button" data-mode="light" class="mode-btn rounded-lg border border-[var(--line)] px-2 py-1.5 text-sm" data-astro-cid-fotxufti>浅色</button><button type="button" data-mode="dark" class="mode-btn rounded-lg border border-[var(--line)] px-2 py-1.5 text-sm" data-astro-cid-fotxufti>深色</button></div><p class="m-0 mb-2 text-xs font-semibold tracking-wide text-[var(--muted)] uppercase" data-astro-cid-fotxufti>配色皮肤</p><div class="grid grid-cols-1 gap-1.5" data-astro-cid-fotxufti>${[
		{
			id: "cyber",
			label: "赛博",
			swatch: "#22d3ee"
		},
		{
			id: "noir-red",
			label: "黑红",
			swatch: "#ef4444"
		},
		{
			id: "navy",
			label: "深蓝",
			swatch: "#1d4ed8"
		},
		{
			id: "amber",
			label: "墨金",
			swatch: "#f59e0b"
		},
		{
			id: "mono",
			label: "黑白",
			swatch: "#222222"
		},
		{
			id: "slate",
			label: "青石",
			swatch: "#0e7490"
		}
	].map((skin) => renderTemplate`<button type="button"${addAttribute(skin.id, "data-skin")} class="skin-btn flex items-center gap-2 rounded-lg border border-[var(--line)] px-2.5 py-2 text-left text-sm transition hover:border-[var(--accent)]" data-astro-cid-fotxufti><span class="inline-block h-4 w-4 rounded-full border border-[var(--line)]"${addAttribute(`background:${skin.swatch}`, "style")} aria-hidden="true" data-astro-cid-fotxufti></span><span data-astro-cid-fotxufti>${skin.label}</span><span class="skin-check ml-auto hidden text-[var(--accent)]" data-astro-cid-fotxufti>✓</span></button>`)}</div></div></div><script>
	(function () {
		const root = document.documentElement;
		const SKIN_KEY = 'blog-skin';
		const MODE_KEY = 'theme';
		const validSkins = ['cyber', 'navy', 'noir-red', 'amber', 'mono', 'slate'];

		function applyMode(mode) {
			root.classList.toggle('dark', mode === 'dark');
			localStorage.setItem(MODE_KEY, mode);
			document.querySelectorAll('.mode-btn').forEach((btn) => {
				btn.classList.toggle('is-active', btn.getAttribute('data-mode') === mode);
			});
			const frame = document.querySelector('iframe.giscus-frame');
			if (frame) {
				frame.contentWindow?.postMessage(
					{ giscus: { setConfig: { theme: mode === 'dark' ? 'dark' : 'light' } } },
					'https://giscus.app',
				);
			}
		}

		function applySkin(skin) {
			const next = validSkins.includes(skin) ? skin : 'cyber';
			root.setAttribute('data-skin', next);
			localStorage.setItem(SKIN_KEY, next);
			document.querySelectorAll('.skin-btn').forEach((btn) => {
				btn.classList.toggle('is-active', btn.getAttribute('data-skin') === next);
			});
		}

		applyMode(localStorage.getItem(MODE_KEY) || 'dark');
		applySkin(localStorage.getItem(SKIN_KEY) || 'cyber');

		const btn = document.getElementById('skin-settings-btn');
		const panel = document.getElementById('skin-settings-panel');
		btn?.addEventListener('click', (e) => {
			e.stopPropagation();
			const open = panel?.classList.toggle('hidden') === false;
			btn.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
		document.addEventListener('click', (e) => {
			if (!panel || panel.classList.contains('hidden')) return;
			if (panel.contains(e.target) || btn?.contains(e.target)) return;
			panel.classList.add('hidden');
			btn?.setAttribute('aria-expanded', 'false');
		});

		document.querySelectorAll('.mode-btn').forEach((el) => {
			el.addEventListener('click', () => applyMode(el.getAttribute('data-mode') || 'light'));
		});
		document.querySelectorAll('.skin-btn').forEach((el) => {
			el.addEventListener('click', () => applySkin(el.getAttribute('data-skin') || 'navy'));
		});
	})();
<\/script>`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/components/SkinSettings.astro", void 0);
// src/components/Header.astro
var $$Header = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<header class="site-header sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/95" data-astro-cid-nen7h5rs><div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-70" data-astro-cid-nen7h5rs></div><nav class="site-shell flex items-center justify-between gap-2 py-2 sm:py-3" data-astro-cid-nen7h5rs><a href="/" class="group min-w-0 flex flex-1 items-center gap-2 no-underline" data-astro-cid-nen7h5rs><span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--accent)] text-[var(--accent)] mono text-xs font-bold" aria-hidden="true" data-astro-cid-nen7h5rs>HZ</span><span class="min-w-0 overflow-hidden" data-astro-cid-nen7h5rs><span class="block truncate text-[0.95rem] font-bold tracking-wide text-[var(--ink)] group-hover:text-[var(--accent)] sm:text-lg" data-astro-cid-nen7h5rs>${SITE_TITLE}</span><span class="hud-label hidden truncate md:block" data-astro-cid-nen7h5rs>node://blog.hongz.cc</span></span></a><div class="flex shrink-0 items-center gap-1.5" data-astro-cid-nen7h5rs><div class="internal-links hidden items-center gap-1 text-sm font-semibold sm:flex" data-astro-cid-nen7h5rs>${renderComponent($$result, "HeaderLink", $$HeaderLink, {
		"href": "/",
		"data-astro-cid-nen7h5rs": true
	}, { "default": ($$result) => renderTemplate`首页` })}${renderComponent($$result, "HeaderLink", $$HeaderLink, {
		"href": "/blog",
		"data-astro-cid-nen7h5rs": true
	}, { "default": ($$result) => renderTemplate`文章` })}${renderComponent($$result, "HeaderLink", $$HeaderLink, {
		"href": "/about",
		"data-astro-cid-nen7h5rs": true
	}, { "default": ($$result) => renderTemplate`关于` })}${false}</div><a class="hidden h-9 w-9 items-center justify-center rounded-md border border-[var(--line)] text-[var(--ink)] no-underline md:inline-flex" href="https://github.com/hongzhe757/cc-hongz-zblog" target="_blank" rel="noreferrer" title="GitHub" data-astro-cid-nen7h5rs><span class="sr-only" data-astro-cid-nen7h5rs>GitHub</span><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" data-astro-cid-nen7h5rs><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" data-astro-cid-nen7h5rs></path></svg></a>${renderComponent($$result, "SkinSettings", $$SkinSettings, { "data-astro-cid-nen7h5rs": true })}<button id="nav-toggle" type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--ink)] sm:hidden" aria-label="打开菜单" aria-expanded="false" aria-controls="mobile-nav" data-astro-cid-nen7h5rs><span class="nav-icon-open mono text-sm" aria-hidden="true" data-astro-cid-nen7h5rs>≡</span><span class="nav-icon-close mono text-sm hidden" aria-hidden="true" data-astro-cid-nen7h5rs>×</span></button></div></nav><div id="mobile-nav" class="mobile-nav hidden border-t border-[var(--line)] sm:hidden" data-astro-cid-nen7h5rs><div class="site-shell flex flex-col gap-1 py-3 text-base font-semibold" data-astro-cid-nen7h5rs>${renderComponent($$result, "HeaderLink", $$HeaderLink, {
		"href": "/",
		"data-astro-cid-nen7h5rs": true
	}, { "default": ($$result) => renderTemplate`首页` })}${renderComponent($$result, "HeaderLink", $$HeaderLink, {
		"href": "/blog",
		"data-astro-cid-nen7h5rs": true
	}, { "default": ($$result) => renderTemplate`文章` })}${renderComponent($$result, "HeaderLink", $$HeaderLink, {
		"href": "/about",
		"data-astro-cid-nen7h5rs": true
	}, { "default": ($$result) => renderTemplate`关于` })}${false}<a class="rounded-md px-3 py-2.5 text-[var(--ink)] no-underline" href="https://github.com/hongzhe757/cc-hongz-zblog" target="_blank" rel="noreferrer" data-astro-cid-nen7h5rs>GitHub</a></div></div></header><script>
	(function () {
		const toggle = document.getElementById('nav-toggle');
		const panel = document.getElementById('mobile-nav');
		const openIcon = toggle?.querySelector('.nav-icon-open');
		const closeIcon = toggle?.querySelector('.nav-icon-close');
		toggle?.addEventListener('click', () => {
			const open = panel?.classList.toggle('hidden') === false;
			toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
			toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
			openIcon?.classList.toggle('hidden', open);
			closeIcon?.classList.toggle('hidden', !open);
		});
	})();
<\/script>`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/components/Header.astro", void 0);
export { $$Footer as n, $$BaseHead as r, $$Header as t };
