<script>
    import ChooseAction from "./ChooseAction.svelte";
    import { getContext } from 'svelte';
	import Stories from "./Stories.svelte";

    const pageContext = getContext('page');
    
    let options = $derived.by(() => {
        let [page, bookId] = pageContext;
        return Stories.getPageOptions(bookId, page);
    });
</script>

{#each options as option}
    <ChooseAction action={option}/>
{/each}