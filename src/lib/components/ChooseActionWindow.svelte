<script>
    import ChooseAction from "./ChooseAction.svelte";
    import { getContext } from 'svelte';
    import Stories from "./Stories.svelte";
    import { PUBLIC_API_URL } from '$env/static/public';
    import { CODE_PAGE, NAME_PAGE } from '$lib/constants';
    import { prefillCodeForClient, ensureClientExists, saveClientCode } from '../userActions.js';
    import { showDelayedLoadingMessage } from "./delayedLoadingMessage";

    const pageContext = getContext('page');
    const clientContext = getContext('client');
    let currentPage = $state(0);

    $effect(() => {
        // access index directly from the proxied $state - it supports numeric access
        currentPage = pageContext ? Number(pageContext[0] ?? 0) : 0;
    });

    /**
     * @type {{ toPage: number, type: string, name: string }[]}
     */
    let options = $state([]);
    let pageType = $state(
        /**@type {"page" | "enter name" | "enter password" | "set name" | "set password"}*/
        ('page')
    );
    let codeValue = $state('');
    let message = $state('');

    const isOnNamePage = $derived(pageType === 'enter name' || pageType === 'set name');
    const isOnCodePage = $derived(pageType === 'enter password' || pageType === 'set password');

    $effect(() => {
        // snapshot primitives to avoid proxied $state usage
        const page = pageContext ? pageContext[0] : undefined;
        const bookId = pageContext ? pageContext[1] : undefined;

        const isPageName = isOnNamePage;
        const isPageCode = isOnCodePage;

        // always clear options when page is 3 (name) or 5 (code)
        if ((isPageName || isPageCode)) {
            options = [];
        }

        // when page is 5, prefill code and do NOT fetch options
        if (isPageCode) {
            (async () => {
                try {
                    if (clientContext && clientContext.id) {
                        const code = await prefillCodeForClient(clientContext.id, PUBLIC_API_URL);
                        if (code) {
                            codeValue = code;
                            message = 'Loaded saved code.';
                        }
                    }
                } catch (e) {
                    console.warn('[ChooseActionWindow] could not prefill code', e);
                }
            })();
            return; // important: do not fetch options for page 5
        }

        // normal options for other pages
        if (clientContext && clientContext._suppressOptions) {
            options = [];
            return;
        }
        console.log('[ChooseActionWindow] page effect', { page, bookId });
        Stories.getPageOptions(bookId, page).then(e => options = e).catch(err => {
            console.error('[ChooseActionWindow] failed getPageOptions', err);
            options = [
                {toPage:0, type: "page", name: "Go back"},
            ];
        });
    })

    async function submitCode() {
        message = '';
        if (!codeValue) return;
        try {
            // Avoid logging sensitive code value
            console.log('[ChooseActionWindow] submitCode start', { hasCode: !!codeValue, clientId: clientContext?.id });
            // ensure client exists via helper
            if (!clientContext.id) {
                const created = await ensureClientExists(PUBLIC_API_URL, clientContext.name || 'guest');
                if (created) {
                    clientContext.id = created.id;
                    clientContext.name = created.name;
                }
            }

            if (!clientContext.id) {
                message = 'No client id available. Could not save code.';
                return;
            }
            const data = await saveClientCode(PUBLIC_API_URL, clientContext.id, codeValue);
            if (data && data.success) {
                message = 'Code saved. Thank you!';
                // reflect saved value from server
                if (data.client && data.client.code) {
                    codeValue = data.client.code;
                }
                // fetch fresh client object to confirm in DB and show id
                try {
                    const verifyJson = await prefillCodeForClient(clientContext.id, PUBLIC_API_URL, true);
                    console.log('[ChooseActionWindow] verify client after save', verifyJson);
                    if (verifyJson && verifyJson.client) {
                        message += ` Saved for user id ${verifyJson.client.id}.`;
                    }
                } catch (ve) {
                    console.warn('[ChooseActionWindow] could not verify client after save', ve);
                }
                // optionally advance page
                try {
                    pageContext[0] = (Number(pageContext[0]) || 0) + 1;
                } catch (e) {
                    console.error('[ChooseActionWindow] advancing page failed', e);
                }
            } else {
                message = 'Could not save code.';
                console.warn('[ChooseActionWindow] save code response', { success: !!data?.success, error: data?.message });
            }
        } catch (err) {
            console.error('[ChooseActionWindow] submitCode error', err);
            message = 'Network error while saving code.';
        }
    }
    
    $effect(() => {
        let [page, bookId] = pageContext;
        
        const optionsPromise = showDelayedLoadingMessage(
            Stories.getPageOptions(bookId, page),
            () => options = []
        );
        const typePromise = Stories.getPageType(bookId, page);

        Promise.all([optionsPromise, typePromise]).then(v => [options, pageType] = v);
    })

</script>
    {#if isOnCodePage && clientContext?.id}
        <div class="story-box">
            <label for="code-input" class="block mb-2 label-dark">Enter the library code (password)</label>
            <input id="code-input" type="password" class="story-input" bind:value={codeValue} placeholder="Type the library code here" />
            <button class="story-button" onclick={submitCode}>Submit code</button>
            {#if message}
                <p class="mt-2 message-text">{message}</p>
            {/if}
        </div>
    {:else if isOnNamePage}
        <!-- when on the name prompt page we intentionally render no choices -->
        <div></div>
    {:else if isOnCodePage}
        <!-- If user reached code page but has no client yet, show nothing -->
        <div></div>
    {:else}
        {#each options as option}
            <ChooseAction action={option}/>
        {/each}
    {/if}
<style>
    .label-dark { color: var(--cover-dark); }
    .message-text { color: #3a3a3a; }
</style>