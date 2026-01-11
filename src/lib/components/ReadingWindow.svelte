<script>
	import TypeWriter from './TypeWriter.svelte.js';
	import Stories from './Stories.svelte.js';
    import { getContext } from 'svelte';
    import { showDelayedLoadingMessage } from './delayedLoadingMessage.js';
	import WordExplainingReadingWindow from './WordExplainingReadingWindow.svelte';
	import { goto } from '$app/navigation';

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

        storyPromise.then(story => myTypeWriter.reset(story))
        .catch(err => {
            // on error, show fallback text but avoid throwing
            myTypeWriter.reset('Failed to load story.');
            console.error('Error loading story for page', page, err);
        });
    })
</script>

<div class="reading-container">
	<button class="exit-button" onclick={() => goto('/')}>✕</button>
	
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

	.exit-button {
		position: absolute;
		top: -180px;
		left: 0;
		width: 45px;
		height: 45px;
		background: linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%);
		color: #6b5437;
		border: 2px solid #d4a574;
		border-radius: 50%;
		font-size: 24px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		z-index: 10;
		box-shadow: 0 4px 12px rgba(107, 84, 55, 0.15);
		font-weight: bold;
	}

	.exit-button:hover {
		background: linear-gradient(135deg, #8b6f47 0%, #6b5437 100%);
		color: #f5e6d3;
		border-color: #6b5437;
		box-shadow: 0 6px 16px rgba(107, 84, 55, 0.3);
		transform: translateY(-2px);
	}

	.exit-button:active {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(107, 84, 55, 0.2);
	}
</style>
