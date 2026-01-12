<script>
	import { getContext, onMount, setContext } from 'svelte';
	import TypeWriter from "./TypeWriter.svelte.js";
	import { I18n } from "$lib/i18n/i18n.svelte.js";

	/**
	 * @type {{speed:number, myTypeWriter:TypeWriter}}
	 */
	const readingSettingsContext = getContext('readingSettings');
	const languageContext = getContext('language');

	let readingSpeed = readingSettingsContext.speed;

	// Create i18n instance that loads translations from backend
	let translator = $state(new I18n(languageContext?.selectedLang || 'en'));
	let translationsLoaded = $state(false);
	let currentLang = $state(languageContext?.selectedLang || 'en');

	// Load translations when component mounts and when language changes
	$effect(() => {
		const lang = languageContext?.selectedLang || 'en';

		// Only reload if language actually changed
		if (lang !== currentLang) {
			currentLang = lang;
			translationsLoaded = false;
			const newTranslator = new I18n(lang);
			newTranslator.load().then(() => {
				translator = newTranslator;
				translationsLoaded = true;
			});
		}
	});

	onMount(() => {
		// when page is loaded, run set reading speed again to force the range input element to show this value
		readingSpeed = readingSettingsContext.speed;

		// Load initial translations
		translator.load().then(() => {
			translationsLoaded = true;
		});
	});

	/**
	 * sets the reading speed when it changes
	 */
	function handleReadingSpeedUpdate() {
		readingSettingsContext?.myTypeWriter?.setSpeed(readingSpeed);
		readingSettingsContext.speed = readingSpeed;
	}
</script>

<div class="w-full">
	<details>
		<summary>⚙{translationsLoaded ? translator.t('settings') : 'Settings'}</summary>
		<div>
			<label for="readingSpeed">{translationsLoaded ? translator.t('readingSpeed') : 'Reading Speed'}</label>
			<input
				type="range"
				id="readingSpeed"
				name="readingSpeed"
				min="5"
				max="80"
				step="5"
				bind:value={readingSpeed}
				on:input={handleReadingSpeedUpdate}
			/>
		</div>
	</details>
</div>
