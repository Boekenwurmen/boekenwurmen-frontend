<script>
    import TypeWriter from './TypeWriter.svelte.js';
    import Stories from './Stories.svelte.js';
    import { getContext } from 'svelte';
    import { showDelayedLoadingMessage } from './delayedLoadingMessage.js';
    import WordExplainingReadingWindow from './WordExplainingReadingWindow.svelte';
    import { goto } from '$app/navigation';
    import ReadingSettings from './ReadingSettings.svelte';

    /**
     * @type {{speed:number, myTypeWriter:TypeWriter}}
     */
    const readingSettingsContext = getContext('readingSettings');
    const readingSpeed = readingSettingsContext.speed;

    /**
     * @type {number[]}
     */
    const pageContext = getContext('page');

    /**
     * @type {{selectedLang: string, availableLanguages: string[]}}
     */
    const languageContext = getContext('language');

    const myTypeWriter = new TypeWriter(readingSpeed, 'Loading...');
    readingSettingsContext.myTypeWriter = myTypeWriter;

    // Guard to avoid repeated fetches or re-entrancy when page doesn't change
    /** @type {number | undefined} */
    let _lastPage = undefined;

    /** @type {number | undefined} */
    let _lastActionClickCount = undefined;

    /** @type {number | undefined} */
    let _lastBookId = undefined;

    /** @type {string | undefined} */
    let _lastLang = undefined;

    /**
     * @type {Promise<string>|null}
     */
    let storyPromise = $state(null);

    $effect(() => {
        // snapshot primitives from proxied $state
        const page = pageContext ? Number(pageContext[0]) : undefined;
        const bookId = pageContext ? Number(pageContext[1]) : undefined;
        const actionClickCount = pageContext ? Number(pageContext[2]) : undefined;
        const lang = languageContext?.selectedLang || 'en';

        if (page === undefined || page === null || bookId === undefined || bookId === null) return; // nothing to do

        // Check if language changed - if so, force re-fetch even if page unchanged
        const langChanged = lang !== _lastLang;
        if (langChanged) {
            _lastLang = lang;
            // Force re-fetch with new language
            storyPromise = showDelayedLoadingMessage(
                Stories.getPageStory(bookId, page, lang),
                () => myTypeWriter.showLoadingMessage()
            );

            storyPromise.then(story => myTypeWriter.reset(story))
            .catch(err => {
                myTypeWriter.reset('Failed to load story.');
                console.error('Error loading story for page', page, err);
            });
            return;
        }

        if (actionClickCount === _lastActionClickCount) {
            // actionClickCount is needed here to trigger the effect to refresh when the page is unchanged
            return; // no button was clicked
        }
        _lastActionClickCount = actionClickCount;

        const isPageUnchanged = page === _lastPage && bookId === _lastBookId;
        if (isPageUnchanged) {
            myTypeWriter.reset(); // show the user that the button they clicked did do something
            return; // already handled this page
        }

        _lastPage = page;
        _lastBookId = bookId;

        // fetch the story for this page, showing a loading message if slow
        storyPromise = showDelayedLoadingMessage(
            Stories.getPageStory(bookId, page, lang),
            () => myTypeWriter.showLoadingMessage()
        );

        storyPromise
            .then(story => myTypeWriter.reset(story))
            .catch(err => {
                // on error, show fallback text but avoid throwing
                myTypeWriter.reset('Failed to load story.');
                console.error('Error loading story for page', page, err);
            });
    });
</script>

<div class="reading-container">
    <p class="story-box typing">
        <WordExplainingReadingWindow
            text={myTypeWriter.shown}
            storyPromise={storyPromise}
        />
    </p>
</div>

<style>
    .reading-container {
        position: relative;
    }
</style>
