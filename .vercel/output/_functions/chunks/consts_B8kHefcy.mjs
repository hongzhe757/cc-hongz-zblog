// \0virtual:astro:logger
var level = "info";
// node_modules/astro/dist/core/render-scope/scope.js
/**
* The channel is a write-once immutable *conduit* shared so every compiled copy
* of this module resolves the same AsyncLocalStorage instance (the prerender
* runtime is bundled, so the build orchestrator and the bundled runtime hold
* different module instances of this file); all mutable per-render state lives
* in stores reachable only through async execution context. Never installed in
* dev or production SSR runtimes. It holds no state, so it stays installed across builds.
*/
var SCOPE_KEY = Symbol.for("astro:render-scope");
/** The installed render scope, or `undefined` when none was installed. */
function getInstalledRenderScope() {
	return globalThis[SCOPE_KEY];
}
/** The current render's collectors store, or `undefined` when not collecting. */
function getRenderCollectors() {
	return getInstalledRenderScope()?.getStore();
}
// node_modules/astro/dist/core/render-scope/record.js
/**
* Records that a content entry was rendered, keyed by its root-relative
* `filePath`. No-op outside of a collecting render (dev, production SSR,
* module top-level).
*/
function recordContentEntryRender(filePath) {
	if (!filePath) return;
	getRenderCollectors()?.contentEntries?.add(filePath);
}
function isCollectingStaticImages() {
	return getRenderCollectors()?.staticImages !== void 0;
}
/** Keeps repeats; `collectPrerenderMetadata()` dedupes them. */
function recordStaticImage(image) {
	getRenderCollectors()?.staticImages?.push(image);
}
/** Records an untransformed image reference against the active render. */
function recordReferencedImage(fsPath) {
	getRenderCollectors()?.referencedImages?.add(fsPath);
}
// node_modules/astro/dist/assets/consts.js
var VALID_INPUT_FORMATS = [
	"jpeg",
	"jpg",
	"png",
	"apng",
	"tiff",
	"webp",
	"gif",
	"svg",
	"avif"
];
/**
* Valid formats that our base services support.
* Certain formats can be imported (namely SVGs) but will not be processed.
*/
var VALID_SUPPORTED_FORMATS = [
	"jpeg",
	"jpg",
	"png",
	"tiff",
	"webp",
	"gif",
	"svg",
	"avif"
];
var DEFAULT_OUTPUT_FORMAT = "webp";
var DEFAULT_HASH_PROPS = [
	"src",
	"width",
	"height",
	"format",
	"quality",
	"fit",
	"position",
	"background"
];
export { isCollectingStaticImages as a, recordStaticImage as c, VALID_SUPPORTED_FORMATS as i, level as l, DEFAULT_OUTPUT_FORMAT as n, recordContentEntryRender as o, VALID_INPUT_FORMATS as r, recordReferencedImage as s, DEFAULT_HASH_PROPS as t };
