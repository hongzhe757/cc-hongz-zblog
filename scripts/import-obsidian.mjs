import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogRoot = path.resolve(__dirname, '..');
const vaultRoot = path.resolve(blogRoot, '..', 'cc-hongz-obsidian');
const outDir = path.join(blogRoot, 'src', 'content', 'blog');

const PLACEHOLDERS = [
	'../../assets/blog-placeholder-1.jpg',
	'../../assets/blog-placeholder-2.jpg',
	'../../assets/blog-placeholder-3.jpg',
	'../../assets/blog-placeholder-4.jpg',
	'../../assets/blog-placeholder-5.jpg',
];

/** Explicit slugs for Chinese-heavy or collision-prone titles. */
const OVERRIDES = {
	系统架构设计: 'system-architecture',
	仓库盘点报告: 'repo-inventory',
	qdox迁移总结: 'ztools-qdox-migrate',
	ztools重构规划: 'ztools-refactor-plan',
	ztools项目约定与工作流: 'ztools-workflow',
	其他工具包总结: 'ztools-misc-tools-pkg',
	ajax与拦截包总结: 'ztools-ajax-intercept-pkg',
	http与标准协议包总结: 'ztools-http-protocol-pkg',
	数据库与框架适配包总结: 'ztools-db-adapt-pkg',
	核心与工厂包总结: 'ztools-response-core-pkg',
	'bean与annotation包移植总结': 'ztools-bean-annotation-port',
	bean包补齐总结: 'ztools-bean-fill',
	builder包设计模式总结: 'ztools-builder-patterns',
	util包重构分析: 'ztools-util-refactor',
	'pinyin与tokenizer包总结': 'ztools-pinyin-tokenizer-pkg',
	'ssh与ftp包总结': 'ztools-ssh-ftp-pkg',
	protector使用指南: 'ztools-protector-guide',
	protector加密总结: 'ztools-protector-encrypt',
	protector加密规划: 'ztools-protector-encrypt-plan',
	protector能力边界与扩展: 'ztools-protector-scope',
	缓存与分布式锁方案对比: 'ztools-cache-lock-compare',
	状态码映射设计: 'ztools-status-code-mapping',
};

function collectSources() {
	const files = [];
	const categories = [
		'01-基础核心',
		'02-数据与文档',
		'03-网络通信',
		'04-安全与防护',
		'05-缓存与任务',
		'06-框架与扩展',
	];
	for (const cat of categories) {
		const dir = path.join(vaultRoot, cat);
		if (!fs.existsSync(dir)) continue;
		walk(dir, files);
	}
	const extras = [
		'系统架构设计.md',
		path.join('90-项目文档', 'qdox迁移总结.md'),
		path.join('90-项目文档', 'ztools重构规划.md'),
		path.join('90-项目文档', 'ztools项目约定与工作流.md'),
		path.join('90-项目文档', '仓库盘点报告.md'),
	];
	for (const rel of extras) {
		const full = path.join(vaultRoot, rel);
		if (fs.existsSync(full)) files.push(full);
	}
	return files.filter((f) => f.endsWith('.md'));
}

function walk(dir, out) {
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) walk(full, out);
		else if (ent.name.endsWith('.md')) out.push(full);
	}
}

function toSlug(baseName) {
	if (OVERRIDES[baseName]) return OVERRIDES[baseName];

	let name = baseName
		.replace(/模块总结$/, '-module')
		.replace(/包总结$/, '-pkg')
		.replace(/包移植总结$/, '-port')
		.replace(/包补齐总结$/, '-fill')
		.replace(/包设计模式总结$/, '-patterns')
		.replace(/包重构分析$/, '-refactor')
		.replace(/加密总结$/, '-encrypt')
		.replace(/迁移总结$/, '-migrate')
		.replace(/重构规划$/, '-refactor-plan')
		.replace(/项目约定与工作流$/, '-workflow')
		.replace(/盘点报告$/, '-inventory')
		.replace(/架构设计$/, '-architecture');

	name = name
		.replace(/([a-zA-Z][a-zA-Z0-9\-]*|\d+)/g, '-$1-')
		.replace(/[^a-zA-Z0-9\-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.toLowerCase();

	if (!name || name === 'ztools' || /[\u4e00-\u9fff]/.test(baseName) && !/[a-z]/.test(name)) {
		const hash = createHash('sha1').update(baseName).digest('hex').slice(0, 6);
		name = `note-${hash}`;
	}

	return name.startsWith('ztools-') || name.startsWith('system-') || name.startsWith('repo-')
		? name
		: `ztools-${name}`;
}

function stripFrontmatter(raw) {
	if (!raw.startsWith('---')) return raw;
	const end = raw.indexOf('\n---', 3);
	if (end === -1) return raw;
	return raw.slice(end + 4).replace(/^\r?\n/, '');
}

function extractTitle(body, fallback) {
	const m = body.match(/^#\s+(.+)$/m);
	if (m) return m[1].replace(/（MOC）/g, '').trim();
	return fallback;
}

function extractDescription(body, title) {
	const quotes = [...body.matchAll(/^>\s*(?!>\s*)(.+)$/gm)].map((m) => m[1]);
	for (const q of quotes) {
		const t = q
			.replace(/`[^`]+`/g, '')
			.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, a, b) => b || a)
			.replace(/\s+/g, ' ')
			.trim();
		if (t.length < 12) continue;
		if (/^(源码位置|对照基准|包路径)/.test(t)) continue;
		return t.slice(0, 140);
	}
	const para = body
		.split(/\n+/)
		.map((l) => l.trim())
		.find(
			(l) =>
				l &&
				!l.startsWith('#') &&
				!l.startsWith('>') &&
				!l.startsWith('|') &&
				!l.startsWith('-') &&
				!l.startsWith('*') &&
				!l.startsWith('```') &&
				!l.startsWith('---'),
		);
	if (para) {
		return para
			.replace(/[\[\]*`#]/g, '')
			.replace(/\s+/g, ' ')
			.trim()
			.slice(0, 140);
	}
	return `${title} — 来自 Obsidian ztools 知识库`;
}

function convertWikiLinks(body, slugByTitle) {
	body = body.replace(/!\[\[([^\]]+)\]\]/g, '');
	body = body.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, target, alias) => {
		const label = (alias || target).trim();
		const key = target.trim();
		const slug =
			slugByTitle.get(key) ||
			slugByTitle.get(`${key}模块总结`) ||
			slugByTitle.get(`${key}包总结`);
		if (slug) return `[${label}](/blog/${slug}/)`;
		return `**${label}**`;
	});
	return body;
}

function clearGeneratedPosts() {
	if (!fs.existsSync(outDir)) return;
	for (const name of fs.readdirSync(outDir)) {
		if (name === 'hello-zblog.md') continue;
		if (!name.endsWith('.md') && !name.endsWith('.mdoc')) continue;
		fs.unlinkSync(path.join(outDir, name));
	}
}

function main() {
	if (!fs.existsSync(vaultRoot)) {
		console.error('Vault not found:', vaultRoot);
		process.exit(1);
	}
	fs.mkdirSync(outDir, { recursive: true });
	clearGeneratedPosts();

	const sources = collectSources();
	const entries = sources.map((full, i) => {
		const base = path.basename(full, '.md');
		const slug = toSlug(base);
		const stripped = stripFrontmatter(fs.readFileSync(full, 'utf8'));
		const title = extractTitle(stripped, base);
		return { full, base, slug, title, stripped, i };
	});

	const used = new Set();
	for (const e of entries) {
		let s = e.slug;
		let n = 2;
		while (used.has(s)) s = `${e.slug}-${n++}`;
		e.slug = s;
		used.add(s);
	}

	const slugByTitle = new Map();
	for (const e of entries) {
		slugByTitle.set(e.base, e.slug);
		slugByTitle.set(e.title, e.slug);
		slugByTitle.set(e.title.replace(/\s*（MOC）\s*$/, ''), e.slug);
	}

	for (const e of entries) {
		const body = convertWikiLinks(e.stripped, slugByTitle).trim() + '\n';
		const description = extractDescription(e.stripped, e.title).replace(/'/g, '’');
		const titleSafe = e.title.replace(/'/g, '’');
		const hero = PLACEHOLDERS[e.i % PLACEHOLDERS.length];
		const md = `---
title: '${titleSafe}'
description: '${description}'
pubDate: 'Nov 08 2026'
heroImage: '${hero}'
---

${body}`;
		fs.writeFileSync(path.join(outDir, `${e.slug}.md`), md, 'utf8');
	}

	const collisions = entries.filter((e) => /-\d+$/.test(e.slug));
	console.log(`Imported ${entries.length} notes → ${outDir}`);
	if (collisions.length) {
		console.warn(
			'Slug collisions:',
			collisions.map((e) => `${e.base} → ${e.slug}`).join('; '),
		);
	}
}

main();
