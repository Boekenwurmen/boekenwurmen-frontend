<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="book-page-container">
	<div class="book-spine"></div>
	<div class="book-content">
		{@render children()}
	</div>
</div>
