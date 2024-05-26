<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="h-dvh box-content content-center">
	{@render children()}
</main>
