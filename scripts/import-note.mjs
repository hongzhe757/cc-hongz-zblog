/**
 * Import markdown from sibling submodule cc-hongz-note into src/content/blog.
 * Skips: root README, pentest/exploit notes, credential dumps.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogRoot = path.resolve(__dirname, '..');
const noteRoot = path.resolve(blogRoot, '..', 'cc-hongz-note');
const outRoot = path.join(blogRoot, 'src', 'content', 'blog');

const PLACEHOLDERS = [
	'blog-placeholder-1.jpg',
	'blog-placeholder-2.jpg',
	'blog-placeholder-3.jpg',
	'blog-placeholder-4.jpg',
	'blog-placeholder-5.jpg',
];

/** Top-level note dirs → blog category + default tags. */
const DIR_MAP = {
	'0x00-版本说明': { category: 'journal', tags: ['笔记', '版本'] },
	'0x01-学习路线': { category: 'journal', tags: ['笔记', '学习'] },
	'0xfe-技术总结': { category: 'engineering', tags: ['笔记', '技术总结'] },
	'0xff-非技术总结': { category: 'journal', tags: ['笔记'] },
};

/** Paths (posix, relative to note root) or basename patterns to skip. */
const SKIP_DIR_PREFIXES = [
	'0xfd-渗透测试培训', // exploit / unauthorized-access writeups
];

const SKIP_BASENAME_RE = [
	/^readme(\.en)?\.md$/i,
	/服务器列表/,
	/内网突破/,
];

function walk(dir, out = []) {
	if (!fs.existsSync(dir)) return out;
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) walk(full, out);
		else if (ent.name.endsWith('.md')) out.push(full);
	}
	return out;
}

function toPosixRel(full) {
	return path.relative(noteRoot, full).split(path.sep).join('/');
}

function shouldSkip(full) {
	const rel = toPosixRel(full);
	const base = path.basename(full);
	if (SKIP_DIR_PREFIXES.some((p) => rel === p || rel.startsWith(`${p}/`))) return 'pentest';
	if (SKIP_BASENAME_RE.some((re) => re.test(base))) return 'sensitive-or-readme';
	if (rel === 'README.md' || rel === 'README.en.md') return 'readme';
	return null;
}

function stripHexPrefix(name) {
	// 0x00000000-title / 0xfe04000004-title / plain title
	return name.replace(/^0x[0-9a-fA-F]+-/, '').trim() || name;
}

function toSlug(baseName, rel) {
	const cleaned = stripHexPrefix(baseName)
		.replace(/\.md$/i, '')
		.replace(/[（(].*?[）)]/g, '')
		.trim();

	let name = cleaned
		.replace(/([a-zA-Z][a-zA-Z0-9\-]*|\d+)/g, '-$1-')
		.replace(/[^a-zA-Z0-9\-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.toLowerCase();

	if (!name || /[\u4e00-\u9fff]/.test(cleaned) && !/[a-z]/.test(name)) {
		const hash = createHash('sha1').update(rel).digest('hex').slice(0, 8);
		name = hash;
	}

	return `note-${name}`.replace(/-+/g, '-').replace(/-$/, '');
}

function stripFrontmatter(raw) {
	if (!raw.startsWith('---')) return raw;
	const end = raw.indexOf('\n---', 3);
	if (end === -1) return raw;
	return raw.slice(end + 4).replace(/^\r?\n/, '');
}

function extractTitle(body, fallback, rel) {
	let fromFile = stripHexPrefix(fallback)
		.replace(/_/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	// Typo / generic README → use parent folder label
	if (/^(readme|redme)$/i.test(fromFile) && rel) {
		const parts = rel.split('/');
		if (parts.length >= 2) {
			fromFile = stripHexPrefix(parts[parts.length - 2]).replace(/_/g, ' ').trim() || fromFile;
		}
	}
	const m = body.match(/^#\s+(.+)$/m);
	if (!m) return fromFile;
	const h1 = m[1].trim();
	// Many notes use "# step1: …" as the first heading — prefer filename.
	if (/^step\s*\d+/i.test(h1) || /^步骤\s*\d+/i.test(h1)) return fromFile;
	if (h1.length < 4 && fromFile.length > h1.length) return fromFile;
	return h1;
}

function extractDescription(body, title) {
	const lines = body.split(/\r?\n/).map((l) => l.trim());
	for (const l of lines) {
		if (!l) continue;
		if (l.startsWith('#') || l.startsWith('```') || l.startsWith('---') || l.startsWith('|')) continue;
		if (l.startsWith('-') || l.startsWith('*') || l.startsWith('>')) continue;
		const t = l
			.replace(/[`*_\[\]#]/g, '')
			.replace(/\s+/g, ' ')
			.trim();
		if (t.length < 8) continue;
		return t.slice(0, 140);
	}
	return `${title} — 来自 cc-hongz-note`;
}

function topicTagFromRel(rel) {
	const parts = rel.split('/');
	if (parts.length < 2) return null;
	const mid = parts[1]; // e.g. 0xfe0400-docker
	const topic = stripHexPrefix(mid);
	if (!topic || topic === mid) return null;
	return topic;
}

function gitFirstAuthorDate(filePath) {
	try {
		const rel = path.relative(noteRoot, filePath).split(path.sep).join('/');
		const out = execFileSync(
			'git',
			['-C', noteRoot, 'log', '--diff-filter=A', '--follow', '--format=%aI', '--', rel],
			{ encoding: 'utf8' },
		)
			.trim()
			.split(/\r?\n/)
			.filter(Boolean);
		if (out.length) return out[out.length - 1];
		const any = execFileSync(
			'git',
			['-C', noteRoot, 'log', '--follow', '--format=%aI', '--', rel],
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
	const d = iso ? new Date(iso) : new Date();
	if (Number.isNaN(d.getTime())) return 'Nov 08, 2026';
	return d.toLocaleDateString('en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
		timeZone: 'Asia/Shanghai',
	});
}

function yamlQuote(s) {
	return `'${String(s).replace(/'/g, '’')}'`;
}

function clearPreviousNoteImports() {
	for (const cat of Object.values(DIR_MAP).map((d) => d.category).concat(['ztools', 'architecture'])) {
		const dir = path.join(outRoot, cat);
		if (!fs.existsSync(dir)) continue;
		for (const name of fs.readdirSync(dir)) {
			if (name.startsWith('note-') && /\.(md|mdx|mdoc)$/.test(name)) {
				fs.unlinkSync(path.join(dir, name));
			}
		}
	}
}

function main() {
	if (!fs.existsSync(noteRoot)) {
		console.error('Note repo not found:', noteRoot);
		process.exit(1);
	}

	clearPreviousNoteImports();

	const all = walk(noteRoot);
	const skipped = [];
	const sources = [];

	for (const full of all) {
		const reason = shouldSkip(full);
		if (reason) {
			skipped.push({ rel: toPosixRel(full), reason });
			continue;
		}
		const top = toPosixRel(full).split('/')[0];
		if (!DIR_MAP[top]) {
			skipped.push({ rel: toPosixRel(full), reason: `unmapped:${top}` });
			continue;
		}
		sources.push(full);
	}

	const used = new Set();
	const entries = [];

	for (let i = 0; i < sources.length; i++) {
		const full = sources[i];
		const rel = toPosixRel(full);
		const top = rel.split('/')[0];
		const map = DIR_MAP[top];
		const base = path.basename(full, '.md');
		let slug = toSlug(base, rel);
		let n = 2;
		while (used.has(slug)) slug = `${toSlug(base, rel)}-${n++}`;
		used.add(slug);

		const raw = fs.readFileSync(full, 'utf8');
		const body = stripFrontmatter(raw).trim() + '\n';
		const title = extractTitle(body, base, rel);
		const description = extractDescription(body, title);
		const topic = topicTagFromRel(rel);
		const tags = [...map.tags];
		if (topic && !tags.includes(topic)) tags.push(topic);
		const pubDate = formatPubDate(gitFirstAuthorDate(full));
		const hero = `../../../assets/${PLACEHOLDERS[i % PLACEHOLDERS.length]}`;

		const md = `---
title: ${yamlQuote(title)}
description: ${yamlQuote(description)}
pubDate: '${pubDate}'
heroImage: '${hero}'
tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]
category: '${map.category}'
---

${body}`;

		const outDir = path.join(outRoot, map.category);
		fs.mkdirSync(outDir, { recursive: true });
		fs.writeFileSync(path.join(outDir, `${slug}.md`), md, 'utf8');
		entries.push({ slug, category: map.category, title, rel });
	}

	console.log(`Imported ${entries.length} notes → ${outRoot}`);
	console.log(`Skipped ${skipped.length}:`);
	const byReason = {};
	for (const s of skipped) {
		byReason[s.reason] = (byReason[s.reason] || 0) + 1;
	}
	for (const [k, v] of Object.entries(byReason)) console.log(`  ${k}: ${v}`);
	for (const e of entries.slice(0, 8)) {
		console.log(`  ${e.category}/${e.slug}.md ← ${e.rel}`);
	}
	if (entries.length > 8) console.log(`  … and ${entries.length - 8} more`);
}

main();
