<script>
    import ReadingWindow from "./ReadingWindow.svelte";
    import ActionWindow from "./ChooseActionWindow.svelte";
    import { setContext } from 'svelte';
	import ReadingSettings from "./ReadingSettings.svelte";

    let page = 1;
    let bookId = 1;
    const bookState = $state([ page, bookId ]);
    setContext('page', bookState);
    setContext('readingSettings', {speed:5, myTypeWriter: null});
</script>

<div class="w-full">
    <ReadingWindow/>
    <ActionWindow/>
    <ReadingSettings/>
</div>