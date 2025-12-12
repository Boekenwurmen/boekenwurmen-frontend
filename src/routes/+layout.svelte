<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import leaderboard from '$lib/assets/leaderboard.svg';
	import library from '$lib/assets/library.svg';
	import reading from '$lib/assets/reading.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>


<header class="bg-yellow-700 flex justify-start align-center gap-4">
	<a href="/">
		<abbr title="Thuismenu">
			<img src={favicon} alt="Library logo" class="header-icon w-30 h-30" />
		</abbr>
	</a>
	<a href="/leaderboard" class="button button--small" aria-label="Toon ranglijst">
		<abbr title="Ranglijst">
			<img src={leaderboard} alt="Leaderboard logo" class="header-icon w-20 h-20" />
		</abbr>
	</a>
	<a href="/library" class="button button--small" aria-label="Toon bibliotheek">
		<abbr title="Bibliotheek">
			<img src={library} alt="Library logo" class="header-icon w-20 h-20" />
		</abbr>
	</a>
	<a href="/read" class="button button--small" aria-label="Toon leespagina">
		<abbr title="Lezen">
			<img src={reading} alt="Reading logo" class="header-icon w-20 h-20" />
		</abbr>
	</a>
</header>
<div class="book-page-container">
	<div class="book-spine"></div>
	{@render children()}
</div>
