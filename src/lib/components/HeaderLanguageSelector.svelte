<script>
	import { getContext } from 'svelte';

	const languageContext = getContext('language');
	const readingSettingsContext = getContext('readingSettings');

	// If no language context, don't render
	if (!languageContext) {
		// Component will not render anything
	}

	function handleLanguageChange(lang) {
		languageContext.selectedLang = lang;

		// Reset TypeWriter animation when language changes
		if (readingSettingsContext?.myTypeWriter) {
			readingSettingsContext.myTypeWriter.reset();
		}
	}

	const languageFlags = {
		en: '🇬🇧',
		nl: '🇳🇱',
		de: '🇩🇪'
	};
</script>

{#if languageContext}
	<div class="language-selector">
		{#each languageContext.availableLanguages as lang}
			<button
				class="flag-btn"
				class:active={languageContext.selectedLang === lang}
				on:click={() => handleLanguageChange(lang)}
				title={lang.toUpperCase()}
			>
				{languageFlags[lang] || '🌐'}
			</button>
		{/each}
	</div>
{/if}

<style>
	.language-selector {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.flag-btn {
		font-size: 24px;
		background: none;
		border: 2px solid transparent;
		border-radius: 6px;
		padding: 4px 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		opacity: 0.6;
	}

	.flag-btn:hover {
		opacity: 1;
		border-color: rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.1);
	}

	.flag-btn.active {
		opacity: 1;
		border-color: rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.2);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}
</style>
