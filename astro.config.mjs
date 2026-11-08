// @ts-check

import mdx from '@astrojs/mdx';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/** Vercel 后台 / 显式 KEYSTATIC_ADMIN=1 */
const admin = process.env.KEYSTATIC_ADMIN === '1' || process.env.VERCEL === '1';
const isDev = process.argv.includes('dev');

/** @type {import('astro').AstroIntegration[]} */
const integrations = [mdx(), sitemap(), react(), markdoc()];
if (admin || isDev) {
	integrations.push(keystatic());
}

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
	: process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: undefined;

// https://astro.build/config
export default defineConfig({
	site: admin && vercelUrl ? vercelUrl : 'https://blog.hongz.cc',
	output: admin ? 'server' : 'static',
	adapter: admin ? vercel() : undefined,
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
