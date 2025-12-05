<script>
    import ChooseAction from "./ChooseAction.svelte";
    import { getContext } from 'svelte';
	import Stories from "./Stories.svelte";
	import { showDelayedLoadingMessage } from "./delayedLoadingMessage";

    /**
     * @type {{pageId:number,bookId:number}}
     */
    const pageContext = getContext('page');

    /**
     * @type {{ toPage: number, name: string }[]}
     */
    let options = $state([]);
    
    $effect(() => {
        let {pageId, bookId} = pageContext;
        showDelayedLoadingMessage(
            Stories.getPageOptions(bookId, pageId),
            () => options = []
        ).then(e => options = e);
    })
</script>

{#each options as option}
    <ChooseAction action={option}/>
{/each}