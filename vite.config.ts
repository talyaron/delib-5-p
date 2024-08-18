import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import svgr from 'vite-plugin-svgr';
import path from 'path';

const manifestPlugin: Partial<VitePWAOptions> = {
	registerType: 'autoUpdate',
	includeAssets: ['favicon.ico'],
	injectRegister: 'inline',
	devOptions: {
		enabled: true,
	},
	workbox: {
		globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
	},
	manifest: {
		name: 'FreeDi App',
		short_name: 'FreeDi',
		description: 'FreeDi: Fostering collaboration',
		theme_color: '#4E88C7',
		background_color: '#4E88C7',
		display: 'standalone',
		orientation: 'portrait',
		icons: [
			{
				src: './src/assets/logo/logo-48px.png',
				sizes: '48x48',
				type: 'image/png',
			},
			{
				src: './src/assets/logo/logo-72px.png',
				sizes: '72x72',
				type: 'image/png',
			},
			{
				src: './src/assets/logo/logo-96px.png',
				sizes: '96x96',
				type: 'image/png',
			},
			{
				src: './src/assets/logo/logo-128px.png',
				sizes: '128x128',
				type: 'image/png',
			},
			{
				src: './src/assets/logo/logo-192px.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: './src/assets/logo/logo-512px.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
		start_url: '/',
	},
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA(manifestPlugin),
		visualizer({ open: true, gzipSize: true, brotliSize: true }),
		svgr({ include: '**/*.svg?react' }),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	define: {
		'process.env': process.env,
	},
});
