import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const withNode = path.join(root, 'scripts', 'with-node.mjs');

const result = spawnSync(process.execPath, [withNode, 'build'], {
	stdio: 'inherit',
	cwd: root,
	env: {
		...process.env,
		KEYSTATIC_ADMIN: '1',
		PUBLIC_KEYSTATIC_STORAGE: 'github',
	},
});

process.exit(result.status ?? 1);
