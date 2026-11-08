import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { t as getCollection } from "./_astro_content_BjKl28YN.mjs";
import { i as SITE_TITLE, n as SITE_DESCRIPTION } from "./consts_BigjK7kT.mjs";
import rss from "@astrojs/rss";
// src/pages/rss.xml.js
var rss_xml_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
async function GET(context) {
	const posts = await getCollection("blog");
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`
		}))
	});
}
// \0virtual:astro:page:src/pages/rss.xml@_@js
var page = () => rss_xml_exports;
export { page };
