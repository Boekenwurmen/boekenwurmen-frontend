<script>
    import ChooseAction from "./ChooseAction.svelte";
    import { getContext } from 'svelte';

    const pageContext = getContext('page');
    
    let options = $derived.by(() => {
        let page = pageContext[0]
        switch (page) {
            case 1: return [
                {toPage:2, name:"You hit the ground out of frustation"},
                {toPage:3, name:"You scream in pain from the sand in your eyes"},
            ]
            case 2: return [
                {toPage:7, name:"Check yourself for wounds"},
                {toPage:6, name:"look around to see where you are"},
            ]
            case 3: return [
                {toPage:5, name:"You ignore the hatch and wander into the desert"},
                {toPage:4, name:"You open the hatch and go inside"},
            ]
            case 4: case 6: case 7: return [
                {toPage:0, name:"Enter library"},
            ]
            case 5: return [
                {toPage:1, name:"Go back"},
            ]
            // case 0: return [
            //     {toPage:2, name:""},
            //     {toPage:2, name:""},
            // ]
            default: return [
                {toPage:1, name:"Go back"},
            ]
        }
    });
</script>

{#each options as option}
    <ChooseAction action={option}/>
{/each}