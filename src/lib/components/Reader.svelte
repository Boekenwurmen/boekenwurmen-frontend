<script>
    import ReadingWindow from "./ReadingWindow.svelte";
    import ActionWindow from "./ChooseActionWindow.svelte";
    import { setContext } from 'svelte';
	import ReadingSettings from "./ReadingSettings.svelte";

    let pageId = 1;
    let bookId = 1;
    const bookState = $state({ pageId, bookId });
    setContext('page', bookState);
    setContext('readingSettings', {speed:50, myTypeWriter: null});
</script>

<div class="w-full">
    <ReadingWindow/>
    <ActionWindow/>
    <ReadingSettings/>
</div>