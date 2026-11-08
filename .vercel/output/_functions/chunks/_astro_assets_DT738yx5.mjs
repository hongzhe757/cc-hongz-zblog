import { Y as UnavailableAstroGlobal, d as FontFamilyNotFound, et as AstroError, k as MissingGetFontFileRequestUrl, v as ImageMissingAlt } from "./errors-data_B-3EQkHs.mjs";
import { D as addAttribute, M as ASTRO_GENERATOR, b as maybeRenderHead, k as unescapeHTML, r as spreadAttributes, y as renderTemplate } from "./jsx-runtime_B3hLhILp.mjs";
import { t as createComponent } from "./astro-component_BaA6IVZM.mjs";
import { t as createConsoleLogger } from "./console_ClfCadOL.mjs";
import { l as level } from "./consts_B8kHefcy.mjs";
import { n as getImage$1 } from "./assets_CVRwngaU.mjs";
import "./compiler_LbqzbmMT.mjs";
import "mrmime";
// node_modules/astro/dist/runtime/server/astro-global.js
function createError(name) {
	return new AstroError({
		...UnavailableAstroGlobal,
		message: UnavailableAstroGlobal.message(name)
	});
}
function createAstro(site) {
	return {
		get site() {
			console.warn(`Astro.site inside getStaticPaths is deprecated and will be removed in a future major version of Astro. Use import.meta.env.SITE instead`);
			return site ? new URL(site) : void 0;
		},
		get generator() {
			console.warn(`Astro.generator inside getStaticPaths is deprecated and will be removed in a future major version of Astro.`);
			return ASTRO_GENERATOR;
		},
		get callAction() {
			throw createError("callAction");
		},
		get clientAddress() {
			throw createError("clientAddress");
		},
		get cookies() {
			throw createError("cookies");
		},
		get csp() {
			throw createError("csp");
		},
		get currentLocale() {
			throw createError("currentLocale");
		},
		get getActionResult() {
			throw createError("getActionResult");
		},
		get isPrerendered() {
			throw createError("isPrerendered");
		},
		get locals() {
			throw createError("locals");
		},
		get originPathname() {
			throw createError("originPathname");
		},
		get params() {
			throw createError("params");
		},
		get preferredLocale() {
			throw createError("preferredLocale");
		},
		get preferredLocaleList() {
			throw createError("preferredLocaleList");
		},
		get props() {
			throw createError("props");
		},
		get redirect() {
			throw createError("redirect");
		},
		get request() {
			throw createError("request");
		},
		get response() {
			throw createError("response");
		},
		get rewrite() {
			throw createError("rewrite");
		},
		get routePattern() {
			throw createError("routePattern");
		},
		get self() {
			throw createError("self");
		},
		get slots() {
			throw createError("slots");
		},
		get url() {
			throw createError("url");
		},
		get session() {
			throw createError("session");
		},
		get cache() {
			throw createError("cache");
		},
		get logger() {
			throw createError("logger");
		}
	};
}
var $$Image = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Image;
	const props = Astro.props;
	if (props.alt === void 0 || props.alt === null) throw new AstroError(ImageMissingAlt);
	if (typeof props.width === "string") props.width = Number.parseInt(props.width);
	if (typeof props.height === "string") props.height = Number.parseInt(props.height);
	const layout = props.layout ?? imageConfig.layout ?? "none";
	if (layout !== "none") {
		props.layout ??= layout;
		props.fit ??= imageConfig.objectFit ?? "cover";
		props.position ??= imageConfig.objectPosition ?? "center";
	} else if (imageConfig.objectFit || imageConfig.objectPosition) {
		if (imageConfig.objectFit) props.fit ??= imageConfig.objectFit;
		if (imageConfig.objectPosition) props.position ??= imageConfig.objectPosition;
	}
	const image = await getImage(props);
	const additionalAttributes = {};
	if (image.srcSet.values.length > 0) additionalAttributes.srcset = image.srcSet.attribute;
	const { class: className, ...attributes } = {
		...additionalAttributes,
		...image.attributes
	};
	return renderTemplate`${maybeRenderHead($$result)}<img${addAttribute(image.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}>`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/node_modules/astro/components/Image.astro", void 0);
// \0virtual:astro:assets/fonts/internal
var componentDataByCssVariable = /* @__PURE__ */ new Map([["--font-atkinson", {
	"preloads": [{
		"style": "normal",
		"type": "woff",
		"url": "/_astro/fonts/89758defcfa85239.woff",
		"weight": "400"
	}, {
		"style": "normal",
		"type": "woff",
		"url": "/_astro/fonts/14aa8dd5744dd4bc.woff",
		"weight": "700"
	}],
	"css": "@font-face{font-family:Atkinson-c7f4c4e8b285552f;src:url(\"/_astro/fonts/89758defcfa85239.woff\") format(\"woff\");font-display:swap;font-weight:400;font-style:normal;}@font-face{font-family:Atkinson-c7f4c4e8b285552f;src:url(\"/_astro/fonts/14aa8dd5744dd4bc.woff\") format(\"woff\");font-display:swap;font-weight:700;font-style:normal;}@font-face{font-family:\"Atkinson-c7f4c4e8b285552f fallback: Arial\";src:local(\"Arial\");font-display:swap;font-weight:400;font-style:normal;size-adjust:99.3717%;ascent-override:80.1033%;descent-override:25.2587%;line-gap-override:0%;}@font-face{font-family:\"Atkinson-c7f4c4e8b285552f fallback: Arial Bold\";src:local(\"Arial Bold\");font-display:swap;font-weight:700;font-style:normal;size-adjust:92.2954%;ascent-override:86.2448%;descent-override:27.1953%;line-gap-override:0%;}:root{--font-atkinson:Atkinson-c7f4c4e8b285552f,\"Atkinson-c7f4c4e8b285552f fallback: Arial\",\"Atkinson-c7f4c4e8b285552f fallback: Arial Bold\",sans-serif;}"
}]]);
// node_modules/astro/dist/assets/fonts/core/filter-preloads.js
function filterPreloads(data, preload) {
	if (!preload) return null;
	if (preload === true) return data;
	return data.filter(({ weight, style, subset }) => preload.some((p) => {
		if (p.weight !== void 0 && weight !== void 0 && !checkWeight(p.weight.toString(), weight)) return false;
		if (p.style !== void 0 && p.style !== style) return false;
		if (p.subset !== void 0 && p.subset !== subset) return false;
		return true;
	}));
}
function checkWeight(input, target) {
	const trimmedInput = input.trim();
	if (trimmedInput.includes(" ")) return trimmedInput === target;
	if (target.includes(" ")) {
		const [a, b] = target.split(" ");
		const parsedInput = Number.parseInt(input);
		return parsedInput >= Number.parseInt(a) && parsedInput <= Number.parseInt(b);
	}
	return input === target;
}
var $$Font = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Font;
	const { cssVariable, preload = false } = Astro.props;
	const data = componentDataByCssVariable.get(cssVariable);
	if (!data) throw new AstroError({
		...FontFamilyNotFound,
		message: FontFamilyNotFound.message(cssVariable)
	});
	const filteredPreloadData = filterPreloads(data.preloads, preload);
	return renderTemplate`<style>${unescapeHTML(data.css)}</style>${filteredPreloadData?.map(({ url, type }) => renderTemplate`<link rel="preload"${addAttribute(url, "href")} as="font"${addAttribute(`font/${type}`, "type")} crossorigin>`)}`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/node_modules/astro/components/Font.astro", void 0);
// node_modules/astro/dist/assets/fonts/infra/ssr-runtime-font-file-url-resolver.js
/**
* During SSR, we don't know ahead of time where the server is located.
* We rely on `requestUrl` (provided by the user) to construct the URL.
*/
var SsrRuntimeFontFileUrlResolver = class {
	#urls;
	constructor({ urls }) {
		this.#urls = urls;
	}
	resolve(url, requestUrl) {
		if (!this.#urls.has(url)) return null;
		if (!url.startsWith("/")) return url;
		if (!requestUrl) throw new AstroError(MissingGetFontFileRequestUrl);
		return `${requestUrl.origin}${url}`;
	}
};
new SsrRuntimeFontFileUrlResolver({ urls: /* @__PURE__ */ new Set(["/_astro/fonts/89758defcfa85239.woff", "/_astro/fonts/14aa8dd5744dd4bc.woff"]) });
// \0astro:assets
var _astroLogger = createConsoleLogger({ level });
var _runtimeLogger = {
	info: (message) => _astroLogger.info(null, message),
	warn: (message) => _astroLogger.warn(null, message),
	error: (message) => _astroLogger.error(null, message)
};
var imageConfig = {
	"endpoint": { "route": "/_image" },
	"service": {
		"entrypoint": "astro/assets/services/sharp",
		"config": {}
	},
	"dangerouslyProcessSVG": false,
	"domains": [],
	"remotePatterns": [],
	"responsiveStyles": false
};
Object.defineProperties(imageConfig, {
	assetQueryParams: {
		value: void 0,
		enumerable: false,
		configurable: true
	},
	staticImageConfig: {
		value: {
			"base": "/",
			"assetsDir": "_astro"
		},
		enumerable: false,
		configurable: true
	}
});
var getImage = async (options) => await getImage$1(options, imageConfig, _runtimeLogger);
export { createAstro as i, $$Font as n, $$Image as r, imageConfig as t };
