import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { r as setOnSetGetEnv, t as getEnv$1 } from "./runtime_CbHAOOc6.mjs";
import { makeGenericAPIRouteHandler } from "@keystatic/core/api/generic";
import { collection, config, fields } from "@keystatic/core";
// \0astro:env/server
/** @returns {string} */
var getEnv = (key) => {
	return getEnv$1(key);
};
var getSecret = (key) => {
	return getEnv(key);
};
setOnSetGetEnv(() => {});
// node_modules/@keystatic/astro/dist/keystatic-astro-api.js
function makeHandler(_config) {
	return async function keystaticAPIRoute(context) {
		var _config$clientId, _config$clientSecret, _config$secret;
		const { body, headers, status } = await makeGenericAPIRouteHandler({
			..._config,
			clientId: (_config$clientId = _config.clientId) !== null && _config$clientId !== void 0 ? _config$clientId : getSecret("KEYSTATIC_GITHUB_CLIENT_ID"),
			clientSecret: (_config$clientSecret = _config.clientSecret) !== null && _config$clientSecret !== void 0 ? _config$clientSecret : getSecret("KEYSTATIC_GITHUB_CLIENT_SECRET"),
			secret: (_config$secret = _config.secret) !== null && _config$secret !== void 0 ? _config$secret : getSecret("KEYSTATIC_SECRET")
		}, { slugEnvName: "PUBLIC_KEYSTATIC_GITHUB_APP_SLUG" })(context.request);
		return new Response(body, {
			status,
			headers
		});
	};
}
// keystatic.config.ts
var keystatic_config_default = config({
	storage: {
		kind: "github",
		repo: "hongzhe757/cc-hongz-zblog"
	},
	collections: { blog: collection({
		label: "博客文章",
		slugField: "title",
		path: "src/content/blog/*",
		format: { contentField: "content" },
		schema: {
			title: fields.slug({ name: { label: "标题" } }),
			description: fields.text({
				label: "摘要",
				multiline: true
			}),
			pubDate: fields.date({
				label: "发布日期",
				validation: { isRequired: true }
			}),
			updatedDate: fields.date({ label: "更新日期" }),
			heroImage: fields.image({
				label: "封面图",
				directory: "src/assets/blog",
				publicPath: "../../assets/blog/"
			}),
			content: fields.markdoc({
				label: "正文",
				options: { image: {
					directory: "src/assets/blog",
					publicPath: "../../assets/blog/"
				} }
			})
		}
	}) }
});
// node_modules/@keystatic/astro/internal/keystatic-api.js
var keystatic_api_exports = /* @__PURE__ */ __exportAll({
	ALL: () => ALL,
	all: () => all,
	prerender: () => false
});
var all = makeHandler({ config: keystatic_config_default });
var ALL = all;
// \0virtual:astro:page:node_modules/@keystatic/astro/internal/keystatic-api@_@js
var page = () => keystatic_api_exports;
export { page };
