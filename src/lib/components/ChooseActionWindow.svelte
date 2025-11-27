<script>
    import ChooseAction from "./ChooseAction.svelte";
    import { getContext } from 'svelte';
	import Stories from "./Stories.svelte";

    const pageContext = getContext('page');
    
    let options = $derived.by(() => {
        let page = pageContext[0];
        return Stories.getPageOptions(page);
    });
</script>

{#each options as option}
    <ChooseAction action={option}/>
{/each}