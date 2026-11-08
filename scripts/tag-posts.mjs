import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = path.join(root, 'src', 'content', 'blog');

/** Infer tags from slug / title heuristics for existing ztools notes. */
function inferTags(slug, title) {
	const tags = new Set();
	const s = `${slug} ${title}`.toLowerCase();

	if (slug === 'hello-zblog') {
		tags.add('博客');
		tags.add('meta');
		return [...tags];
	}
	if (slug.includes('architecture') || title.includes('架构')) {
		tags.add('架构');
	}
	if (slug.includes('inventory') || slug.includes('workflow') || slug.includes('refactor') || slug.includes('qdox')) {
		tags.add('工程');
		tags.add('ztools');
	}
	if (slug.startsWith('ztools-') || slug.startsWith('system-') || title.toLowerCase().includes('ztools') || title.includes('模块') || title.includes('包')) {
		tags.add('ztools');
	}

	const rules = [
		[/http|socket|net|ssh|ftp|mail/, '网络'],
		[/crypto|jwt|captcha|dfa|bloom|protector|security/, '安全'],
		[/json|poi|excel|word|ofd|db|数据库/, '数据'],
		[/cache|cron|锁/, '缓存任务'],
		[/aop|log|response|script|ai|status/, '框架'],
		[/core|util|lang|io|text|map|date|bean|collection|convert|codec|clone|compress|math|thread|stream|swing|img|exceptions|getter|compiler|comparator|builder|setting|extra|pinyin|template|expression|misc/, '基础核心'],
		[/system/, '系统'],
	];

	for (const [re, tag] of rules) {
		if (re.test(s)) tags.add(tag);
	}

	if (tags.size === 0) tags.add('笔记');
	return [...tags];
}

function upsertTags(raw, tags) {
	const tagLine = `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`;
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) {
		return `---\n${tagLine}\n---\n\n${raw}`;
	}
	let fm = match[1].replace(/^tags:\s*(?:\[[^\]]*\]|(?:\r?\n[ \t]*-[^\r\n]*)+)/m, '').replace(/\n{2,}/g, '\n').trimEnd();
	fm = `${fm}\n${tagLine}`;
	return `---\n${fm}\n---\n${match[2]}`;
}

function extractTitle(raw) {
	const m = raw.match(/^title:\s*'([^']+)'/m) || raw.match(/^title:\s*"([^"]+)"/m) || raw.match(/^title:\s*(.+)$/m);
	return m ? m[1].trim() : '';
}

let n = 0;
for (const name of fs.readdirSync(blogDir)) {
	if (!name.endsWith('.md') && !name.endsWith('.mdoc')) continue;
	const full = path.join(blogDir, name);
	const slug = name.replace(/\.(md|mdoc|mdx)$/, '');
	const raw = fs.readFileSync(full, 'utf8');
	const title = extractTitle(raw);
	const tags = inferTags(slug, title);
	fs.writeFileSync(full, upsertTags(raw, tags), 'utf8');
	n++;
}
console.log(`Tagged ${n} posts`);
