/**
 * Backfill blog pubDate from Obsidian vault git first-author dates.
 * Falls back to blog-repo first commit (follow) when vault mapping is missing.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogRoot = path.resolve(__dirname, '..');
const vaultRoot = path.resolve(blogRoot, '..', 'cc-hongz-obsidian');
const blogDir = path.join(blogRoot, 'src', 'content', 'blog');

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

	if (!name || name === 'ztools' || (/[\u4e00-\u9fff]/.test(baseName) && !/[a-z]/.test(name))) {
		const hash = createHash('sha1').update(baseName).digest('hex').slice(0, 6);
		name = `note-${hash}`;
	}

	return name.startsWith('ztools-') || name.startsWith('system-') || name.startsWith('repo-')
		? name
		: `ztools-${name}`;
}

function walk(dir, out = []) {
	if (!fs.existsSync(dir)) return out;
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) walk(full, out);
		else if (ent.name.endsWith('.md')) out.push(full);
	}
	return out;
}

function gitFirstAuthorDate(repo, filePath) {
	try {
		const rel = path.relative(repo, filePath).split(path.sep).join('/');
		const out = execFileSync(
			'git',
			['-C', repo, 'log', '--diff-filter=A', '--follow', '--format=%aI', '--', rel],
			{ encoding: 'utf8' },
		)
			.trim()
			.split(/\r?\n/)
			.filter(Boolean);
		if (out.length) return out[out.length - 1];
		const any = execFileSync(
			'git',
			['-C', repo, 'log', '--follow', '--format=%aI', '--', rel],
			{ encoding: 'utf8' },
		)
			.trim()
			.split(/\r?\n/)
			.filter(Boolean);
		return any.length ? any[any.length - 1] : null;
	} catch {
		return null;
	}
}

function formatPubDate(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return null;
	return d.toLocaleDateString('en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
		timeZone: 'Asia/Shanghai',
	});
}

function upsertPubDate(raw, pubDate) {
	if (/^pubDate:\s*.+$/m.test(raw)) {
		return raw.replace(/^pubDate:\s*.+$/m, `pubDate: '${pubDate}'`);
	}
	return raw.replace(/^---\r?\n/, `---\npubDate: '${pubDate}'\n`);
}

function collectVaultSlugDates() {
	const categories = [
		'01-基础核心',
		'02-数据与文档',
		'03-网络通信',
		'04-安全与防护',
		'05-缓存与任务',
		'06-框架与扩展',
	];
	const files = [];
	for (const cat of categories) walk(path.join(vaultRoot, cat), files);
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

	const used = new Set();
	const map = new Map();
	for (const full of files) {
		const base = path.basename(full, '.md');
		let slug = toSlug(base);
		let n = 2;
		while (used.has(slug)) slug = `${toSlug(base)}-${n++}`;
		used.add(slug);
		const iso = gitFirstAuthorDate(vaultRoot, full);
		if (iso) map.set(slug, iso);
	}
	return map;
}

function main() {
	if (!fs.existsSync(vaultRoot)) {
		console.error('Vault not found:', vaultRoot);
		process.exit(1);
	}

	const vaultDates = collectVaultSlugDates();
	const posts = walk(blogDir);
	let updated = 0;
	const samples = [];

	for (const full of posts) {
		const slug = path.basename(full, '.md');
		let iso = vaultDates.get(slug);
		if (!iso) iso = gitFirstAuthorDate(blogRoot, full);
		if (!iso) {
			console.warn('skip (no git date):', slug);
			continue;
		}
		const pubDate = formatPubDate(iso);
		if (!pubDate) continue;
		const raw = fs.readFileSync(full, 'utf8');
		const next = upsertPubDate(raw, pubDate);
		if (next !== raw) {
			fs.writeFileSync(full, next, 'utf8');
			updated++;
			if (samples.length < 8) samples.push(`${slug} → ${pubDate}`);
		}
	}

	console.log(`Updated pubDate on ${updated}/${posts.length} posts`);
	for (const s of samples) console.log(' ', s);
}

main();
