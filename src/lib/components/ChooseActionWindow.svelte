<script>
    import ChooseAction from "./ChooseAction.svelte";
    import { getContext } from 'svelte';

    const pageContext = getContext('page');
    
    let options = $derived.by(() => {
        let page = pageContext[0]
        switch (page) {
            case 1: return [
                {name:'read', toPage:2},
                {name:'don\'t read', toPage:2},
            ]
            case 2: return [
                {name:'yes', toPage:2},
                {name:'no', toPage:2},
            ]
            default: return [
                {name:'go back', toPage:1},
            ]
        }
    });
</script>

{#each options as option}
    <ChooseAction action="{option}"/>
{/each}