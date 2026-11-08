import { D as addAttribute, b as maybeRenderHead, y as renderTemplate } from "./jsx-runtime_B3hLhILp.mjs";
import { t as createComponent } from "./astro-component_BaA6IVZM.mjs";
import { i as createAstro } from "./_astro_assets_DT738yx5.mjs";
import "./compiler_LbqzbmMT.mjs";
// src/components/FormattedDate.astro
createAstro("https://example.vercel.app");
var $$FormattedDate = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FormattedDate;
	const { date } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<time${addAttribute(date.toISOString(), "datetime")}>${date.toLocaleDateString("en-us", {
		year: "numeric",
		month: "short",
		day: "numeric"
	})}</time>`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/components/FormattedDate.astro", void 0);
export { $$FormattedDate as t };
