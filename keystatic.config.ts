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
			path: 'src/content/blog/*',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({ name: { label: '标题' } }),
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
				heroImage: fields.image({
					label: '封面图',
					directory: 'src/assets/blog',
					publicPath: '../../assets/blog/',
				}),
				content: fields.markdoc({
					label: '正文',
					options: {
						image: {
							directory: 'src/assets/blog',
							publicPath: '../../assets/blog/',
						},
					},
				}),
			},
		}),
	},
});
