<script>
	import TypeWriter from './TypeWriter.svelte.js';
	import Stories from './Stories.svelte.js';
    import { getContext, setContext } from 'svelte';
    
    /**
     * @type {{speed:number, myTypeWriter:TypeWriter}}
     */
    const readingSettingsContext = getContext('readingSettings');
    const readingSpeed = readingSettingsContext.speed;
    // const readingSpeed = 5;

    /**
     * @type {number[]}
     */
    const pageContext = getContext('page');
    const myTypeWriter = new TypeWriter(readingSpeed, 'loading...');
    readingSettingsContext.myTypeWriter = myTypeWriter;
    // setContext('typewriter', myTypeWriter);

    $effect(() => {
        let [page, bookId] = pageContext;
        Stories.getPageStory(bookId, page).then(story => myTypeWriter.reset(story));
    });

    // $effect(() => {
    //     let [readingSpeed] = readingSettingsContext;
    //     myTypeWriter.setSpeed(readingSpeed);
    // });
</script>

<p class="w-full border rounded-lg p-4 typing">{myTypeWriter.shown}</p>