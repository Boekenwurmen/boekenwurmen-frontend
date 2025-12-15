<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>


<header class="bg-yellow-700">
	<a href="/">
		<img src={favicon} alt="Library logo" class="header-icon w-30 h-30" />
	</a>
</header>
<div class="book-page-container">
	<div class="book-spine"></div>
	{@render children()}
</div>
