<script>
	import TypeWriter from './TypeWriter.svelte.js';
	import Stories from './Stories.svelte.js';
    import { getContext, setContext } from 'svelte';
	import { showDelayedLoadingMessage } from './delayedLoadingMessage.js';
    
    /**
     * @type {{speed:number, myTypeWriter:TypeWriter}}
     */
    const readingSettingsContext = getContext('readingSettings');
    const readingSpeed = readingSettingsContext.speed;

    /**
     * @type {{pageId:number,bookId:number}}
     */
    const pageContext = getContext('page');
    const myTypeWriter = new TypeWriter(readingSpeed, 'Loading...');
    readingSettingsContext.myTypeWriter = myTypeWriter;

    $effect(() => {
        let {pageId, bookId} = pageContext;
        
        showDelayedLoadingMessage(
            Stories.getPageStory(bookId, pageId),
            () => myTypeWriter.showLoadingMessage()
        ).then(story => myTypeWriter.reset(story));
    });
</script>

<p class="w-full border rounded-lg p-4 typing">{myTypeWriter.shown}</p>