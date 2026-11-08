/** 保留给手工诊断；日常请用 npm run dev（会自动切换 scoop Node） */
const major = Number(process.versions.node.split('.')[0]);
const need = 22;

if (Number.isNaN(major) || major < need) {
	console.error('');
	console.error(`[zblog] 当前 Node = ${process.version}，过旧（需要 >= ${need}）。`);
	console.error('[zblog] 直接运行: npm run dev  （会自动用 scoop 的 nodejs24）');
	console.error('  或双击 start-dev.bat');
	console.error('');
	process.exit(1);
}

console.log(`[zblog] Node ${process.version} OK`);
