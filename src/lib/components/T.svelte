<script>
	import { getContext, onMount } from 'svelte';
	import { I18n } from '$lib/i18n/i18n.svelte.js';

	let { key, fallback = key } = $props();

	const languageContext = getContext('language');
	let translator = $state(new I18n(languageContext?.selectedLang || 'en'));
	let loaded = $state(false);
	let text = $state(fallback);

	// Load translations and update when language changes
	$effect(() => {
		if (!languageContext) {
			text = fallback;
			return;
		}

		const lang = languageContext.selectedLang || 'en';
		loaded = false;
		const newTranslator = new I18n(lang);
		newTranslator.load().then(() => {
			translator = newTranslator;
			text = translator.t(key);
			loaded = true;
		});
	});
</script>

{text}
