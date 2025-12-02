<script>
    import ReadingWindow from "./ReadingWindow.svelte";
    import ActionWindow from "./ChooseActionWindow.svelte";
    import { setContext } from 'svelte';

    let page = 1;
    let bookId = 1;
    const state = $state([ page, bookId ]);
    setContext('page', state);

    // client context holds created client id and name
    const client = $state({ id: null, name: null });
    setContext('client', client);
</script>

<div class="w-full">
    <ReadingWindow/>
    <ActionWindow/>
</div>