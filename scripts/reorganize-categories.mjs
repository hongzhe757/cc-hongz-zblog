import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = path.join(root, 'src', 'content', 'blog');
const assetRel = '../../../assets/blog-placeholder-1.jpg';

const CATEGORIES = ['ztools', 'engineering', 'architecture', 'journal'];

function inferCategory(slug, title, tags) {
	const s = `${slug} ${title} ${(tags || []).join(' ')}`.toLowerCase();
	if (slug === 'hello-zblog' || tags.includes('博客') || tags.includes('meta') && !tags.includes('ztools')) {
		if (slug === 'hello-zblog') return 'journal';
	}
	if (slug.includes('architecture') || title.includes('架构') || tags.includes('架构')) return 'architecture';
	if (
		slug.includes('inventory') ||
		slug.includes('workflow') ||
		slug.includes('refactor') ||
		slug.includes('qdox') ||
		tags.includes('工程')
	) {
		return 'engineering';
	}
	if (tags.includes('博客') || tags.includes('meta')) return 'journal';
	if (slug.startsWith('ztools-') || slug.startsWith('system-') || tags.includes('ztools')) return 'ztools';
	if (s.includes('模块') || s.includes('包')) return 'ztools';
	return 'journal';
}

function parseFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) return { fm: '', body: raw, tags: [] };
	const fm = match[1];
	const tagsMatch = fm.match(/tags:\s*\[([^\]]*)\]/);
	const tags = tagsMatch
		? tagsMatch[1]
				.split(',')
				.map((t) => t.trim().replace(/^["']|["']$/g, ''))
				.filter(Boolean)
		: [];
	const titleMatch = fm.match(/^title:\s*'([^']+)'/m) || fm.match(/^title:\s*"([^"]+)"/m);
	return { fm, body: match[2], tags, title: titleMatch?.[1] || '' };
}

function upsertFields(fm, fields) {
	let next = fm;
	for (const [key, value] of Object.entries(fields)) {
		const line =
			typeof value === 'string' && value.startsWith('[')
				? `${key}: ${value}`
				: `${key}: ${value}`;
		if (new RegExp(`^${key}:`, 'm').test(next)) {
			next = next.replace(new RegExp(`^${key}:.*$`, 'm'), line);
		} else {
			next = `${next.trimEnd()}\n${line}`;
		}
	}
	// heroImage path for nested folders
	if (/^heroImage:/m.test(next)) {
		next = next.replace(
			/^heroImage:\s*'([^']+)'/m,
			(_m, p) => {
				const name = path.posix.basename(p.replace(/\\/g, '/'));
				return `heroImage: '../../../assets/${name}'`;
			},
		);
	} else {
		next += `\nheroImage: '${assetRel}'`;
	}
	return next;
}

for (const cat of CATEGORIES) {
	fs.mkdirSync(path.join(blogDir, cat), { recursive: true });
}

const files = fs
	.readdirSync(blogDir, { withFileTypes: true })
	.filter((d) => d.isFile() && /\.(md|mdoc|mdx)$/.test(d.name));

let moved = 0;
for (const ent of files) {
	const from = path.join(blogDir, ent.name);
	const slug = ent.name.replace(/\.(md|mdoc|mdx)$/, '');
	const raw = fs.readFileSync(from, 'utf8');
	const { fm, body, tags, title } = parseFrontmatter(raw);
	const category = inferCategory(slug, title, tags);
	const nextFm = upsertFields(fm || `title: '${slug}'\ndescription: ''\npubDate: 'Nov 08 2026'`, {
		category: `'${category}'`,
	});
	const outName = ent.name;
	const toDir = path.join(blogDir, category);
	const to = path.join(toDir, outName);
	fs.writeFileSync(to, `---\n${nextFm.trim()}\n---\n${body}`, 'utf8');
	fs.unlinkSync(from);
	moved++;
	console.log(`${ent.name} → ${category}/${outName}`);
}

console.log(`Reorganized ${moved} posts into category folders`);
