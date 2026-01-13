<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import HeaderLanguageSelector from '$lib/components/HeaderLanguageSelector.svelte';
	import { setContext } from 'svelte';

	let { children } = $props();

	// Global language context for translation support
	const languageContext = $state({
		selectedLang: 'en', // Default to English
		availableLanguages: ['en', 'nl', 'de'] // Languages available in LibreTranslate
	});
	setContext('language', languageContext);

	// Load selected language from localStorage on mount
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem('selectedLanguage');
		if (saved && languageContext.availableLanguages.includes(saved)) {
			languageContext.selectedLang = saved;
		}
	}

	// Save selected language to localStorage when it changes
	$effect(() => {
		const lang = languageContext.selectedLang;
		if (typeof window !== 'undefined' && lang) {
			localStorage.setItem('selectedLanguage', lang);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="flex items-center justify-between bg-yellow-700 px-4">
	<a href="/">
		<img src={favicon} alt="Library logo" class="header-icon h-30 w-30" />
	</a>
	<HeaderLanguageSelector />
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
