import { config, fields, collection } from '@keystatic/core';

/** 默认本地写文件；线上 GitHub 登录发文时设 PUBLIC_KEYSTATIC_STORAGE=github */
const useGithub = import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github';

export default config({
	storage: useGithub
		? {
				kind: 'github',
				repo: 'hongzhe757/cc-hongz-zblog',
			}
		: {
				kind: 'local',
			},
	collections: {
		blog: collection({
			label: '博客文章',
			slugField: 'title',
			// ** 支持分类目录：slug 形如 journal/hello-zblog
			path: 'src/content/blog/**',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({
					name: { label: '标题' },
					slug: {
						label: '路径 slug',
						description: '含分类目录，例如 journal/my-post 或 ztools/core-pkg',
					},
				}),
				description: fields.text({
					label: '摘要',
					multiline: true,
				}),
				pubDate: fields.date({
					label: '发布日期',
					validation: { isRequired: true },
				}),
				updatedDate: fields.date({
					label: '更新日期',
				}),
				category: fields.select({
					label: '分类',
					options: [
						{ label: 'ztools', value: 'ztools' },
						{ label: '工程', value: 'engineering' },
						{ label: '架构', value: 'architecture' },
						{ label: '随笔', value: 'journal' },
					],
					defaultValue: 'journal',
				}),
				heroImage: fields.image({
					label: '封面图',
					directory: 'src/assets/blog',
					publicPath: '../../../assets/blog/',
				}),
				tags: fields.array(fields.text({ label: '标签' }), {
					label: '标签',
					itemLabel: (props) => props.value || '标签',
				}),
				content: fields.markdoc({
					label: '正文',
					// 现有文章都是 .md，默认 .mdoc 会读成 0 篇
					extension: 'md',
					options: {
						image: {
							directory: 'src/assets/blog',
							publicPath: '../../../assets/blog/',
						},
					},
				}),
			},
		}),
	},
});
