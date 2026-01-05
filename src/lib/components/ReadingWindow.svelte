<script>
	import TypeWriter from './TypeWriter.svelte.js';
	import Stories from './Stories.svelte.js';
    import { getContext } from 'svelte';
    import { showDelayedLoadingMessage } from './delayedLoadingMessage.js';
	import WordExplainingReadingWindow from './WordExplainingReadingWindow.svelte';
    
    /**
     * @type {{speed:number, myTypeWriter:TypeWriter}}
     */
    const readingSettingsContext = getContext('readingSettings');
    const readingSpeed = readingSettingsContext.speed;

    /**
     * @type {number[]}
     */
    const pageContext = getContext('page');
    const myTypeWriter = new TypeWriter(readingSpeed, 'Loading...');
    readingSettingsContext.myTypeWriter = myTypeWriter;

    // Guard to avoid repeated fetches or re-entrancy when page doesn't change
    /** @type {number | undefined} */
    let _lastPage = undefined;
    // primitive snapshot of current page for template/reactivity

    /**
     * @type {Promise<string>|null}
     */
    let storyPromise = $state(null);

    let _lastActionClickCount = 0;
    let _lastBookId = 0;

    $effect(() => {
        // snapshot primitives from proxied $state
        const page = pageContext ? Number(pageContext[0]) : undefined;
        const bookId = pageContext ? Number(pageContext[1]) : undefined;
        const actionClickCount = pageContext ? Number(pageContext[3]) : undefined;

        if (page === undefined || page === null || bookId === undefined || bookId === null) return; // nothing to do

        const isPageUnchanged = page === _lastPage && bookId === _lastBookId && actionClickCount === _lastActionClickCount;
        // actionClickCount is needed here to trigger the effect to refresh when the page is unchanged
        if (isPageUnchanged) {
            // myTypeWriter.reset(); // show the user that the button they clicked did do something
            return; // already handled this page
        }

        _lastPage = page;
        _lastBookId = bookId;
        // if (actionClickCount !== null && actionClickCount !== undefined) {
        //     _lastActionClickCount = actionClickCount;
        // }

        // fetch the story for this page, showing a loading message if slow
        storyPromise = showDelayedLoadingMessage(
            Stories.getPageStory(bookId, page),
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

<p class="story-box typing">
    <WordExplainingReadingWindow 
        text={myTypeWriter.shown}
        storyPromise={storyPromise}
    />
</p>
