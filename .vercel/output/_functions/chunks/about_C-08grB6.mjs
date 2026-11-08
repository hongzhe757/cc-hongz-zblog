import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { D as addAttribute, d as renderComponent, x as renderHead, y as renderTemplate } from "./jsx-runtime_B3hLhILp.mjs";
import { t as createComponent } from "./astro-component_BaA6IVZM.mjs";
import "./compiler_LbqzbmMT.mjs";
import { n as $$Footer, r as $$BaseHead, t as $$Header } from "./Header_DhSVDWH4.mjs";
import { i as SITE_TITLE, r as SITE_LANG } from "./consts_BigjK7kT.mjs";
// src/pages/about.astro
var about_exports = /* @__PURE__ */ __exportAll({
	default: () => $$About,
	file: () => $$file,
	url: () => $$url
});
var $$About = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`<html${addAttribute(SITE_LANG, "lang")} data-astro-cid-ta2fbyqs><head>${renderComponent($$result, "BaseHead", $$BaseHead, {
		"title": `关于 · ${SITE_TITLE}`,
		"description": "秦鸿哲（hongz）项目时间轴：按起始年份排列",
		"data-astro-cid-ta2fbyqs": true
	})}${renderHead($$result)}</head><body data-astro-cid-ta2fbyqs>${renderComponent($$result, "Header", $$Header, { "data-astro-cid-ta2fbyqs": true })}<main class="site-shell py-4 sm:py-12" data-astro-cid-ta2fbyqs><section class="panel relative px-3.5 py-6 sm:px-10 sm:py-10" data-astro-cid-ta2fbyqs><p class="hud-label m-0" data-astro-cid-ta2fbyqs>Profile / Projects</p><h1 class="mt-2 mb-2 text-[1.6rem] font-bold tracking-tight text-[var(--ink)] sm:mt-3 sm:text-4xl" data-astro-cid-ta2fbyqs>秦鸿哲 <span class="text-[var(--accent)]" data-astro-cid-ta2fbyqs>/ hongz</span></h1><p class="m-0 text-sm text-[var(--muted)] sm:text-base" data-astro-cid-ta2fbyqs>项目时间轴 · 按起始年份从早到晚</p><p class="mt-3 mb-0 text-sm leading-relaxed text-[var(--ink)] sm:mt-4 sm:text-base" data-astro-cid-ta2fbyqs>Java 全栈 / 架构，约 10 年。覆盖互联网金融、智能汽车（V2X/V2I）、医疗医保、停车充电、实验室信息化与科研申报。</p><div class="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-3" data-astro-cid-ta2fbyqs><a class="btn-cyber btn-cyber-primary" href="mailto:hongzhe.qin@outlook.com" data-astro-cid-ta2fbyqs>邮件联系</a><a class="btn-cyber btn-cyber-ghost" href="https://github.com/hongzhe757" target="_blank" rel="noreferrer" data-astro-cid-ta2fbyqs>GitHub</a><a class="btn-cyber btn-cyber-ghost" href="/blog" data-astro-cid-ta2fbyqs>看文章</a></div></section><section class="mt-6 sm:mt-10" data-astro-cid-ta2fbyqs><p class="hud-label m-0" data-astro-cid-ta2fbyqs>Timeline</p><h2 class="mt-1 mb-4 text-lg font-bold text-[var(--ink)] sm:mb-6 sm:text-2xl" data-astro-cid-ta2fbyqs>项目时间轴</h2><ol class="timeline m-0 list-none p-0" data-astro-cid-ta2fbyqs>${[
		{
			year: "2013",
			period: "2013.02 — 2014.02",
			title: "游戏脚本 / 桌面工具",
			role: "开发",
			body: "VB / VC++ 桌面工具与自动化脚本：图像识别、钩子、窗口绑定，早期独立工程实践。"
		},
		{
			year: "2014",
			period: "2014.06 — 2016.06",
			title: "三亚福音医院官网改造",
			role: "开发工程师",
			body: "PHP / Java 双版本官网：需求分析、库表设计、第三方客服对接与运维。"
		},
		{
			year: "2017",
			period: "2017.04 — 2018.03",
			title: "医保智能审核 / 监控审核系统",
			role: "JAVA 开发工程师 · 金仕达卫宁",
			body: "规则引擎违规分析，面向医生与社保中心；参保人 / 就诊 / 处方 / 结算等多维数据，落地超过 20 个地市。"
		},
		{
			year: "2018",
			period: "2018.04 — 2020.03",
			title: "银行消费贷款 / 银企直连",
			role: "高级工程师 · 中电金信",
			body: "汽车消贷、马消贷与烟草银企直连：对接核心 / ESB / 影像 / 签章；Blaze 规则引擎与风控；多地市回单报表。"
		},
		{
			year: "2020",
			period: "2020.04 — 2024.02",
			title: "V2I 仿真测试平台",
			role: "Web 端架构 / 主程 · 中电金信",
			body: "从 0 到 1：百度地图 2D 仿真、试点城市红绿灯、HOOK 推送车机 GPS；绿灯 / 闯红灯 / RSI 等 V2I 服务。"
		},
		{
			year: "2021",
			period: "2021.01 — 2024.02",
			title: "V2X 仿真测试平台",
			role: "Web 端架构 / 主程 · 中电金信",
			body: "虚幻引擎 3D 升级：C-V2X 场景与中间件、高精地图园区、国标 / 国外红绿灯、2017/2019 多标准；Jenkins / Sonar 联调。"
		},
		{
			year: "2024",
			period: "2024.04 — 2025.02",
			title: "E 泊士智慧停车 / 道闸",
			role: "Web 端架构 / 主程",
			body: "国央企停车场收费与道闸模块研发、规范建设与上线部署；停车充电一体化。"
		},
		{
			year: "2024",
			period: "2024.04 — 2025.02",
			title: "科研课题申报 / AI 落地",
			role: "申报与集成",
			body: "省厅级科研课题材料与审查；AI 相关项目集成落地。"
		},
		{
			year: "2025",
			period: "2025.06 — 2025.12",
			title: "实验室管理软件 LIMS",
			role: "全栈 · 上海赛印",
			body: "委托订单、样品管理、检测管理、报告管理等核心模块前后端交付。"
		},
		{
			year: "2025",
			period: "2025.12 — 2026.01",
			title: "信贷研发（个贷 / 网贷）",
			role: "全栈 · 南天信息",
			body: "个人信贷与网贷系统前后端研发。"
		}
	].map((item) => renderTemplate`<li class="timeline-item" data-astro-cid-ta2fbyqs><div class="timeline-rail" aria-hidden="true" data-astro-cid-ta2fbyqs><span class="timeline-year mono" data-astro-cid-ta2fbyqs>${item.year}</span></div><div class="timeline-card panel" data-astro-cid-ta2fbyqs><p class="mono m-0 text-[0.7rem] text-[var(--accent)] sm:text-xs" data-astro-cid-ta2fbyqs>${item.period}</p><h3 class="mt-1.5 mb-1 text-base font-bold text-[var(--ink)] sm:text-lg" data-astro-cid-ta2fbyqs>${item.title}</h3><p class="m-0 mb-2 text-xs text-[var(--muted)] sm:text-sm" data-astro-cid-ta2fbyqs>${item.role}</p><p class="m-0 text-sm leading-relaxed text-[var(--muted)]" data-astro-cid-ta2fbyqs>${item.body}</p></div></li>`)}</ol></section><section class="panel mt-8 px-3.5 py-5 sm:mt-12 sm:px-6 sm:py-6" data-astro-cid-ta2fbyqs><p class="hud-label m-0" data-astro-cid-ta2fbyqs>Contact</p><p class="mt-2 mb-0 text-sm text-[var(--muted)]" data-astro-cid-ta2fbyqs>邮箱 <a href="mailto:hongzhe.qin@outlook.com" data-astro-cid-ta2fbyqs>hongzhe.qin@outlook.com</a>· 本站 Astro + Pages · 评论 Giscus（GitHub 登录）</p></section></main>${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-ta2fbyqs": true })}</body></html>`;
}, "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/pages/about.astro", void 0);
var $$file = "D:/workspace/code_workspace/code_misrui/cc-hongz-parent/cc-hongz-zblog/src/pages/about.astro";
var $$url = "/about";
// \0virtual:astro:page:src/pages/about@_@astro
var page = () => about_exports;
export { page };
