<svelte:head>
    <title>Facetherapie User</title>
</svelte:head>

<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
</script>

{@render children()}
