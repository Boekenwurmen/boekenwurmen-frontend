<script>
    import ReadingWindow from "./ReadingWindow.svelte";
    import ActionWindow from "./ChooseActionWindow.svelte";
    import { setContext } from 'svelte';

    let page = 1;
    const state = $state([ page ]);
    setContext('page', state);
</script>

<div class="w-full">
    <ReadingWindow/>
    <ActionWindow/>
</div>