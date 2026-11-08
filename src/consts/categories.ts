export const CATEGORIES = {
	ztools: {
		id: 'ztools',
		label: 'ztools',
		description: '工具库模块与包总结',
	},
	engineering: {
		id: 'engineering',
		label: '工程',
		description: '工作流、仓库盘点、迁移与重构',
	},
	architecture: {
		id: 'architecture',
		label: '架构',
		description: '系统设计与架构笔记',
	},
	journal: {
		id: 'journal',
		label: '随笔',
		description: '站点与日常笔记',
	},
} as const;

export type CategoryId = keyof typeof CATEGORIES;

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];

export function isCategoryId(value: string): value is CategoryId {
	return value in CATEGORIES;
}

export function categoryLabel(id: string) {
	return isCategoryId(id) ? CATEGORIES[id].label : id;
}
