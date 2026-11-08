import { s as recordReferencedImage } from "./consts_B8kHefcy.mjs";
// node_modules/astro/dist/assets/utils/image-asset.js
var RAW_SRC = Symbol.for("astro:image-asset:raw-src");
function createImageAsset(metadata, fsPath, track) {
	const asset = { ...metadata };
	Object.defineProperty(asset, "fsPath", {
		value: fsPath,
		enumerable: false
	});
	if (track) {
		let src = metadata.src;
		Object.defineProperty(asset, RAW_SRC, { get: () => src });
		Object.defineProperty(asset, "src", {
			enumerable: true,
			configurable: true,
			get() {
				recordReferencedImage(fsPath);
				return src;
			},
			set(value) {
				src = value;
			}
		});
	} else Object.defineProperty(asset, RAW_SRC, { get: () => asset.src });
	return asset;
}
function getUntrackedImage(image) {
	if (typeof image !== "object" || image === null || !(RAW_SRC in image)) return image;
	const asset = image;
	const copy = {};
	for (const key of Object.keys(asset)) copy[key] = key === "src" ? asset[RAW_SRC] : asset[key];
	Object.defineProperty(copy, "fsPath", {
		value: asset.fsPath,
		enumerable: false
	});
	return copy;
}
export { getUntrackedImage as n, createImageAsset as t };
