<script>
    import ChooseAction from "./ChooseAction.svelte";
    import { getContext } from 'svelte';
	import Stories from "./Stories.svelte";

    const pageContext = getContext('page');

    /**
     * @type {{ toPage: number, name: string }[]}
     */
    let options = $state([]);
    
    $effect(() => {
        let [page, bookId] = pageContext;
        Stories.getPageOptions(bookId, page).then(e => options = e);
    })
</script>

{#each options as option}
    <ChooseAction action={option}/>
{/each}