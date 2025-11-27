<script>
    import ReadingWindow from "./ReadingWindow.svelte";
    import ActionWindow from "./ChooseActionWindow.svelte";

    import { setContext } from 'svelte';
    import { SvelteSet } from 'svelte/reactivity';
    let page = 1;
    const state = $state([ page ]);
    setContext('page', state);
</script>

<div>
    <ReadingWindow page={page}/>
    <ActionWindow page={page}/>
</div>