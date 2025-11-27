<script>
    import ReadingWindow from "./ReadingWindow.svelte";
    import ActionWindow from "./ChooseActionWindow.svelte";

    import { setContext } from 'svelte';
    import { SvelteSet } from 'svelte/reactivity';
    // let { width = 100, height = 100, children } = $props();
    // let canvas;
    // let items = new SvelteSet();
    let page = 1;
    const state = $state([ page ]);
    setContext('page', state);
</script>

<div>
    <ReadingWindow page={page}/>
    <ActionWindow page={page}/>
</div>