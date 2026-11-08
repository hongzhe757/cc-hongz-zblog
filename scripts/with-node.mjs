import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const NEED_MAJOR = 22;
const major = Number(process.versions.node.split('.')[0] || 0);

function findScoopNode() {
	const home = process.env.USERPROFILE || os.homedir();
	const candidates = [
		path.join(home, 'scoop', 'apps', 'nodejs24', 'current', 'node.exe'),
		path.join(home, 'scoop', 'apps', 'nodejs-lts', 'current', 'node.exe'),
		path.join(home, 'scoop', 'apps', 'nodejs20', 'current', 'node.exe'),
		path.join(home, 'scoop', 'apps', 'nodejs18', 'current', 'node.exe'),
	];
	return candidates.find((p) => fs.existsSync(p));
}

let nodeBin = process.execPath;
if (!(major >= NEED_MAJOR)) {
	const found = findScoopNode();
	if (!found) {
		console.error('');
		console.error(`[zblog] 当前 Node = ${process.version}，Astro 需要 >= ${NEED_MAJOR}。`);
		console.error('[zblog] 未找到 scoop 的 nodejs24/20/18。请先安装：scoop install nodejs24');
		console.error('  或双击 start-dev.bat');
		console.error('');
		process.exit(1);
	}
	// nodejs18 major 18 < 22 — only accept if major >= NEED
	const probe = spawnSync(found, ['-p', 'process.versions.node'], { encoding: 'utf8' });
	const foundVer = (probe.stdout || '').trim();
	const foundMajor = Number(foundVer.split('.')[0] || 0);
	if (foundMajor < NEED_MAJOR) {
		console.error(`[zblog] 找到 ${found} (v${foundVer})，仍低于 ${NEED_MAJOR}。请: scoop install nodejs24`);
		process.exit(1);
	}
	console.log(`[zblog] 系统默认 Node ${process.version} 过旧，已自动切换 -> v${foundVer}`);
	nodeBin = found;
}

const astroCli = path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs');
if (!fs.existsSync(astroCli)) {
	console.error('[zblog] 未找到 Astro，请先在本目录执行: npm install');
	process.exit(1);
}

const args = process.argv.slice(2);
const result = spawnSync(nodeBin, [astroCli, ...args], {
	stdio: 'inherit',
	cwd: root,
	env: process.env,
	shell: false,
});
process.exit(result.status ?? 1);
