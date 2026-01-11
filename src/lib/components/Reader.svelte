<script>
    import ReadingWindow from "./ReadingWindow.svelte";
    import ActionWindow from "./ChooseActionWindow.svelte";
    import { setContext } from 'svelte';
    import ReadingSettings from "./ReadingSettings.svelte";
	import InsertPasswordWindow from "./InsertPasswordWindow.svelte";
	import InsertNameWindow from "./InsertNameWindow.svelte";
	import Stories from "./Stories.svelte";
    import { page } from '$app/stores';
    import ProgressBar from './ProgressBar.svelte';
    
    
    let pageId = 0;
    const bookParam = $page.url.searchParams.get('book');
    let bookId =  bookParam ? parseInt(bookParam) : 0
    let clickCount = 0;

    const pageContext = $state([ pageId, bookId, clickCount ]);

    // client context holds created client id and name
    const client = $state({ id: null, name: null });
    setContext('client', client);

    setContext('page', pageContext);
    setContext('readingSettings', {speed:50, myTypeWriter: null});

    // Language context for translation support
    const languageContext = $state({
        selectedLang: 'en', // Default to English (source language)
        availableLanguages: ['en', 'nl', 'de'] // Only languages loaded in LibreTranslate
    });
    setContext('language', languageContext);

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
            .then(v => pageType = v).catch(err => {
            // on error, show fallback text but avoid throwing
            console.error('Error loading story for page', page, err);
        });
    })

    // Load selected language from localStorage on mount
    $effect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('selectedLanguage');
            if (saved && languageContext.availableLanguages.includes(saved)) {
                languageContext.selectedLang = saved;
            }
        }
    });

    // Save selected language to localStorage when it changes
    $effect(() => {
        const lang = languageContext.selectedLang;
        if (typeof window !== 'undefined' && lang) {
            localStorage.setItem('selectedLanguage', lang);
        }
    });
</script>

<div class="w-full">
    <!-- <p>isOnNamePage {isOnNamePage}, isOnCodePage {isOnCodePage}</p> -->
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
    <ReadingSettings/>
</div>