<script lang="ts">
	import '../app.css';
	import { pwaInfo } from 'virtual:pwa-info';

	let { children } = $props();

	let webManifest = $state('');
	$effect(() => {
		if (pwaInfo) {
			webManifest = pwaInfo.webManifest.linkTag;
		}
	});
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

<main class="h-dvh box-content content-center">
	{@render children()}
</main>
