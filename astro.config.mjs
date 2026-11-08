// @ts-check

import mdx from '@astrojs/mdx';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const admin = process.env.KEYSTATIC_ADMIN === '1';

/** @type {import('astro').AstroIntegration[]} */
const integrations = [mdx(), sitemap(), react(), markdoc()];
// 读者站静态构建不挂 Keystatic；本地 dev 或 KEYSTATIC_ADMIN=1 时启用后台
if (admin || process.argv.includes('dev')) {
	integrations.push(keystatic());
}

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.hongz.cc',
	output: admin ? 'server' : 'static',
	integrations,
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
