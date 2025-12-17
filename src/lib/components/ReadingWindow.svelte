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

    let finalText = $state('');

    $effect(() => {
        // snapshot primitives from proxied $state
        const page = pageContext ? Number(pageContext[0]) : undefined;
        const bookId = pageContext ? Number(pageContext[1]) : undefined;

        if (page == null) return; // nothing to do
        if (page === _lastPage) return; // already handled this page
        _lastPage = page;

        // fetch the story for this page, showing a loading message if slow
        const storyPromise = showDelayedLoadingMessage(
            Stories.getPageStory(bookId, page),
            () => myTypeWriter.showLoadingMessage()
        );

        storyPromise.then(story => {
            myTypeWriter.reset(story)
            finalText = story;
        })
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
        completeText={finalText}
    />
</p>