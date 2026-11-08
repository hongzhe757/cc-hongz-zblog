export const SITE_TITLE = 'hongz';
export const SITE_DESCRIPTION = '工程笔记 · 架构实践 · 折腾记录';
export const SITE_LANG = 'zh-CN';

/** Giscus：用 GitHub 登录评论。首次请到 https://giscus.app/zh 按仓库生成后改这里 */
export const GISCUS = {
	repo: 'hongzhe757/cc-hongz-zblog',
	repoId: 'R_kgDOVm6Dew',
	category: 'General',
	categoryId: 'DIC_kwDOVm6De84DKpZ8',
	mapping: 'pathname',
	strict: '0',
	reactionsEnabled: '1',
	emitMetadata: '0',
	inputPosition: 'top',
	/** 实际主题由页面脚本按站点明暗同步为 noborder_light / noborder_dark */
	theme: 'noborder_light',
	lang: 'zh-CN',
} as const;
