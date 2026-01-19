<script>
	import { getContext } from 'svelte';

	const languageContext = getContext('language');
	const readingSettingsContext = getContext('readingSettings');

	function handleLanguageChange() {
		// Reset TypeWriter animation when language changes
		if (readingSettingsContext?.myTypeWriter) {
			readingSettingsContext.myTypeWriter.reset();
		}
	}

	const languageNames = {
		nl: 'Nederlands',
		en: 'English',
		de: 'Deutsch',
		fr: 'Français',
		es: 'Español',
		it: 'Italiano',
		pt: 'Português',
		ru: 'Русский',
		zh: '中文',
		ja: '日本語',
		ar: 'العربية'
	};
</script>

<div class="language-selector">
	<label for="language-select" class="language-label">🌐 Taal / Language</label>
	<select
		id="language-select"
		class="language-dropdown"
		bind:value={languageContext.selectedLang}
		on:change={handleLanguageChange}
	>
		{#each languageContext.availableLanguages as lang}
			<option value={lang}>{languageNames[lang] || lang.toUpperCase()}</option>
		{/each}
	</select>
</div>

<style>
	.language-selector {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 16px;
		padding: 12px;
		background: linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%);
		border: 2px solid #d4a574;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(107, 84, 55, 0.15);
	}

	.language-label {
		font-size: 14px;
		font-weight: 600;
		color: #6b5437;
		margin: 0;
	}

	.language-dropdown {
		width: 100%;
		padding: 8px 12px;
		font-size: 14px;
		color: #6b5437;
		background-color: #fff;
		border: 2px solid #d4a574;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.3s ease;
		outline: none;
	}

	.language-dropdown:hover {
		border-color: #8b6f47;
		background-color: #faf8f5;
	}

	.language-dropdown:focus {
		border-color: #6b5437;
		box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.2);
	}

	.language-dropdown option {
		padding: 8px;
		color: #6b5437;
	}
</style>
