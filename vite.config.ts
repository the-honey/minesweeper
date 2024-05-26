import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
// import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
		// SvelteKitPWA({
		// 	srcDir: './src',
		// 	mode: 'development',
		// 	strategies: 'generateSW',
		// 	scope: '/',
		// 	base: '/',
		// 	// selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
		// 	manifest: {
		// 		short_name: 'SvelteKit PWA',
		// 		name: 'SvelteKit PWA',
		// 		start_url: '/',
		// 		scope: '/',
		// 		display: 'standalone',
		// 		theme_color: '#ffffff',
		// 		background_color: '#ffffff',
		// 		icons: [
		// 			{
		// 				src: '/favicon.png',
		// 				sizes: '128x128',
		// 				type: 'image/png'
		// 			}
		// 			// {
		// 			// 	src: '/pwa-512x512.png',
		// 			// 	sizes: '512x512',
		// 			// 	type: 'image/png'
		// 			// },
		// 			// {
		// 			// 	src: '/pwa-512x512.png',
		// 			// 	sizes: '512x512',
		// 			// 	type: 'image/png',
		// 			// 	purpose: 'any maskable'
		// 			// }
		// 		]
		// 	},
		// 	injectManifest: {
		// 		globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
		// 	},
		// 	workbox: {
		// 		globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
		// 	},
		// 	devOptions: {
		// 		enabled: true,
		// 		// suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
		// 		type: 'module',
		// 		navigateFallback: '/'
		// 	},
		// 	// if you have shared info in svelte config file put in a separate module and use it also here
		// 	kit: {
		// 		includeVersionFile: true
		// 	}
		// }),
	]
});
