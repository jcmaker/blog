// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.justincho.dev',
	integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/admin') })],
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Inter',
			cssVariable: '--font-inter',
			weights: [400, 500, 600, 700, 800],
			// Inter에는 한글이 없어서 한글은 기기 기본 글꼴로 나온다.
			fallbacks: ['Apple SD Gothic Neo', 'Malgun Gothic', 'system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.fontsource(),
			name: 'JetBrains Mono',
			cssVariable: '--font-jetbrains-mono',
			weights: [400, 600],
			fallbacks: ['ui-monospace', 'Menlo', 'monospace'],
		},
	],
});
