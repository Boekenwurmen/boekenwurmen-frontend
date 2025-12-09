<script>
    import ReadingWindow from "./ReadingWindow.svelte";
    import ActionWindow from "./ChooseActionWindow.svelte";
    import { setContext } from 'svelte';
	import ReadingSettings from "./ReadingSettings.svelte";

    let pageId = 0;
    let bookId = 1;

    const state = $state([ page, bookId ]);

    // client context holds created client id and name
    const client = $state({ id: null, name: null });
    setContext('client', client);

    const bookState = $state({ pageId, bookId });
    setContext('page', bookState);
    setContext('readingSettings', {speed:50, myTypeWriter: null});

</script>

<div class="w-full">
    <ReadingWindow/>
    <ActionWindow/>
    <ReadingSettings/>
</div>