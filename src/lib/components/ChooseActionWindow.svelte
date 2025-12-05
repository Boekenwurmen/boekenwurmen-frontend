<script>
    import ChooseAction from "./ChooseAction.svelte";
    import { getContext } from 'svelte';
	import Stories from "./Stories.svelte";

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
        Stories.getPageOptions(bookId, pageId).then(e => options = e);
    })
</script>

{#each options as option}
    <ChooseAction action={option}/>
{/each}