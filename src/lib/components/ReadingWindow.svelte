<script>
	import TypeWriter from './TypeWriter.svelte.js';
	import Stories from './Stories.svelte.js';
    import { getContext } from 'svelte';

    const pageContext = getContext('page');
    const myTypeWriter = new TypeWriter();

    $effect(() => {
        let page = pageContext[0];
        const story = Stories.getPageStory(page);
        queueMicrotask(() => {
            myTypeWriter.reset(story);
        });
    })
</script>

<p class="max-w-2xl border rounded-lg p-4 typing">{myTypeWriter.shown}</p>