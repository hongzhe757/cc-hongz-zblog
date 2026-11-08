/**
 * Force local Keystatic storage so `npm run admin` works without GitHub App OAuth.
 * Vercel can still set PUBLIC_KEYSTATIC_STORAGE=github separately.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNode = path.join(__dirname, 'with-node.mjs');

process.env.PUBLIC_KEYSTATIC_STORAGE = 'local';
delete process.env.KEYSTATIC_ADMIN;

const child = spawn(
	process.execPath,
	[withNode, 'dev', '--host', '127.0.0.1', '--port', '4321', '--force'],
	{
		stdio: 'inherit',
		env: process.env,
		cwd: path.resolve(__dirname, '..'),
	},
);

child.on('exit', (code, signal) => {
	if (signal) process.kill(process.pid, signal);
	process.exit(code ?? 1);
});
