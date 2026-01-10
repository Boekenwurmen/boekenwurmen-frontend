<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="flex items-center justify-between bg-yellow-700 px-4">
	<a href="/">
		<img src={favicon} alt="Library logo" class="header-icon h-30 w-30" />
	</a>
	<a
		href="/admin"
		class="mr-6 text-xl rounded bg-yellow-800 px-6 py-2 font-bold text-white transition-colors hover:bg-yellow-900"
	>
		⚙️ Admin
	</a>
</header>
<div class="book-page-container">
	<div class="book-spine"></div>
	{@render children()}
</div>
