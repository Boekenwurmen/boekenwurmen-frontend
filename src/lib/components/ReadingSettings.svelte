<script>
    import { getContext, onMount, setContext } from "svelte";
    import TypeWriter from "./TypeWriter.svelte.js";
    import LanguageSelector from "./LanguageSelector.svelte";
    import { I18n } from "$lib/i18n/i18n.svelte.js";

    /**
     * @type {{speed:number, myTypeWriter:TypeWriter}}
     */
    const readingSettingsContext = getContext('readingSettings');
    const languageContext = getContext('language');

    let readingSpeed = readingSettingsContext.speed;

    // Create i18n instance that updates when language changes
    let translator = $derived(new I18n(languageContext?.selectedLang || 'en'));

    onMount(() => {
        // when page is loaded, run set reading speed again to force the range input element to show this value
        readingSpeed = readingSettingsContext.speed;
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
        <summary>{translator.t('settings')}</summary>
        <div>
            <label for="readingSpeed">{translator.t('readingSpeed')}</label>
            <input type="range" id="readingSpeed" name="readingSpeed" min="5" max="80" step="5" bind:value={readingSpeed} on:input={handleReadingSpeedUpdate}/>
        </div>
        <LanguageSelector />
    </details>
</div>