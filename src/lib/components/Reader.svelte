<script>
    import ReadingWindow from "./ReadingWindow.svelte";
    import ActionWindow from "./ChooseActionWindow.svelte";
    import { setContext } from 'svelte';

    let page = 1;
    let bookId = 1;
    const state = $state([ page, bookId ]);
    setContext('page', state);
</script>

<div>
    <ReadingWindow/>
    <ActionWindow/>
</div>