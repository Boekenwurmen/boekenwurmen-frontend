<script>
	import TypeWriter from './TypeWriter.svelte.js';
	import Stories from './Stories.svelte.js';
    import { getContext, setContext } from 'svelte';
    
    /**
     * @type {{speed:number, myTypeWriter:TypeWriter}}
     */
    const readingSettingsContext = getContext('readingSettings');
    const readingSpeed = readingSettingsContext.speed;

    /**
     * @type {{pageId:number,bookId:number}}
     */
    const pageContext = getContext('page');
    const myTypeWriter = new TypeWriter(readingSpeed, 'loading...');
    readingSettingsContext.myTypeWriter = myTypeWriter;

    $effect(() => {
        let {pageId, bookId} = pageContext;
        Stories.getPageStory(bookId, pageId).then(story => myTypeWriter.reset(story));
    });
</script>

<p class="w-full border rounded-lg p-4 typing">{myTypeWriter.shown}</p>