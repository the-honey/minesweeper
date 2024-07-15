<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="h-dvh box-content select-none content-center">
	{@render children()}
</main>
