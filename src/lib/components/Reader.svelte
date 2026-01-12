<script>
    import ReadingWindow from './ReadingWindow.svelte';
    import ActionWindow from './ChooseActionWindow.svelte';
    import { setContext } from 'svelte';
    import ReadingSettings from './ReadingSettings.svelte';
    import InsertPasswordWindow from './InsertPasswordWindow.svelte';
    import InsertNameWindow from './InsertNameWindow.svelte';
    import Stories from './Stories.svelte';
    import { page } from '$app/stores';
    import ProgressBar from './ProgressBar.svelte';
    import { INTRODUCTION_BOOK_ID, ACCOUNT_CREATION_PAGE } from "$lib/constants.ts";
    import SkipIntroButton from "./SkipIntroButton.svelte";
    import ExitButton from "./ExitButton.svelte";
    
    
    const bookParam = $page.url.searchParams.get('book');
    const pageParam = $page.url.searchParams.get('page');
    const typeParam = $page.url.searchParams.get('type');

    let bookId =  bookParam ? parseInt(bookParam) : INTRODUCTION_BOOK_ID;
    let pageId =  pageParam ? parseInt(pageParam) : 0;
    let clickCount = 0;

    switch (typeParam) {
        case 'register':
            pageId = ACCOUNT_CREATION_PAGE;
            break;
    }

    const pageContext = $state([ pageId, bookId, clickCount ]);

    // client context holds created client id and name
    const client = $state({ id: null, name: null });
    setContext('client', client);

    setContext('page', pageContext);
    setContext('readingSettings', { speed: 50, myTypeWriter: null });

    let pageType = $state(
        /**@type {"page" | "enter name" | "enter password" | "set name" | "set password"}*/
        ('page')
    );

    const isOnNamePage = $derived(pageType === 'enter name' || pageType === 'set name');
    const isOnCodePage = $derived(pageType === 'enter password' || pageType === 'set password');

    $effect(() => {
        // snapshot primitives from proxied $state
        const page = pageContext ? Number(pageContext[0]) : undefined;
        const bookId = pageContext ? Number(pageContext[1]) : undefined;

        // fetch the story for this page, showing a loading message if slow

        Stories.getPageType(bookId, page)
            .then(v => pageType = v)
            .catch(err => {
                // on error, show fallback text but avoid throwing
                console.error('Error loading story for page', page, err);
            });
    });
</script>

<div class="w-full">
    <!-- <p>isOnNamePage {isOnNamePage}, isOnCodePage {isOnCodePage}</p> -->
    <ExitButton/>
    {#if bookId === INTRODUCTION_BOOK_ID}
        <SkipIntroButton/>
    {/if}

    <ReadingWindow/>
    {#if isOnNamePage}
        <InsertNameWindow/>
    {/if}
    {#if isOnCodePage}
        <InsertPasswordWindow/>
    {/if}
    {#if !isOnCodePage && !isOnNamePage}
        <ActionWindow/>
    {/if}
    <ProgressBar/>
</div>
