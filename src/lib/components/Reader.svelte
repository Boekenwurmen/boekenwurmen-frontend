<script>
    import ReadingWindow from "./ReadingWindow.svelte";
    import ActionWindow from "./ChooseActionWindow.svelte";
    import { setContext } from 'svelte';
    import ReadingSettings from "./ReadingSettings.svelte";

    let page = 0;
    let bookId = 0;

    const state = $state([ page, bookId ]);

    // client context holds created client id and name
    const client = $state({ id: null, name: null });
    setContext('client', client);

    setContext('page', state);
    setContext('readingSettings', {speed:50, myTypeWriter: null});

</script>

<div class="w-full">
    <ReadingWindow/>
    <ActionWindow/>
    <ReadingSettings/>
</div>