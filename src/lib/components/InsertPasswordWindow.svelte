<script>
    import { getContext } from 'svelte';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { prefillCodeForClient, saveClientCode, registerClient } from '../userActions.js';
	import { showDelayedLoadingMessage } from './delayedLoadingMessage.js';
	import Stories from './Stories.svelte.js';
	import { followOption } from '$lib/readingActions.js';

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
    const submitOption = $derived(options.find(opt => opt.type === "submit"));
    const errorOptions = $derived(options.filter(opt => opt.type === "onError"));
    const errorOptionBadPassword = $derived(errorOptions.find(opt => opt.name === "bad passord"));
    const errorOptionUnknown = $derived(errorOptions.find(opt => opt.name === "service unavailable"));
    let codeValue = $state('');
    let message = $state('');

    $effect(() => {
        // when page is 5, prefill code and do NOT fetch options
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
        
        const page = pageContext ? Number(pageContext[0]) : undefined;
        const bookId = pageContext ? Number(pageContext[1]) : undefined;
        
        const optionsPromise = showDelayedLoadingMessage(
            Stories.getPageOptions(bookId, page),
            () => options = []
        );

        optionsPromise.then(v => options = v)
            .catch(err => {
                console.error('[ChooseActionWindow] failed getPageOptions', err);
                options = [
                    {toPage:0, type: "page", name: "Go back"},
                ];
            });
    })

    async function submitCode() {
        message = '';
        if (!codeValue) return;
        if (codeValue.length < 10) {
            message = 'That is a bad password, try making it longer.';
            if (followOption(pageContext, errorOptionBadPassword)) return;
            return;
        }
        try {
            // Avoid logging sensitive code value
            console.log('[ChooseActionWindow] submitCode start', { hasCode: !!codeValue, clientId: clientContext?.id });
            if (!clientContext.name) {
                message = 'Please enter your name first.';
                return;
            }

            if (!clientContext.id) {
                // Register new client with name + code
                const { status, data } = await registerClient(PUBLIC_API_URL, clientContext.name, codeValue);
                if (status === 201 && data && data.success && data.client) {
                    clientContext.id = data.client.id;
                    // proceed to next page
                    try {
                        pageContext[0] = (Number(pageContext[0]) || 0) + 1;
                        if (followOption(pageContext, submitOption)) return;
                    } catch (e) {
                        console.error('[ChooseActionWindow] advancing page failed after register', e);
                        if (followOption(pageContext, errorOptionUnknown)) return;
                    }
                } else if (status === 409) {
                    message = 'That name is already taken. Please go back and choose a different name.';
                } else if (status >= 400 && status < 500) {
                    if (followOption(pageContext, errorOptionBadPassword)) return;
                    message = data?.message || 'That is a bad password, try making it longer.';
                } else {
                    console.warn('[ChooseActionWindow] register client response', { success: !!data?.success, error: data?.message });
                    if (followOption(pageContext, errorOptionUnknown)) return;
                    message = 'Could not create your account.';
                }
            } else {
                // Existing client: update code only
                const { status, data } = await saveClientCode(PUBLIC_API_URL, clientContext.id, codeValue);
                if (status >= 200 && status < 300 && data && data.success && data.client) {
                    message = 'Code saved. Thank you!';
                    try {
                        pageContext[0] = (Number(pageContext[0]) || 0) + 1;
                        if (followOption(pageContext, submitOption)) return;
                    } catch (e) {
                        console.error('[ChooseActionWindow] advancing page failed', e);
                        if (followOption(pageContext, errorOptionUnknown)) return;
                    }
                } else if (status >= 400 && status < 500) {
                    if (followOption(pageContext, errorOptionBadPassword)) return;
                    message = data?.message || 'That is a bad password, try making it longer.';
                } else {
                    console.warn('[ChooseActionWindow] save code response', { success: !!data?.success, error: data?.message });
                    if (followOption(pageContext, errorOptionUnknown)) return;
                    message = 'Could not save code.';
                }
            }
        } catch (err) {
            console.error('[ChooseActionWindow] submitCode error', err);
            if (followOption(pageContext, errorOptionUnknown)) return;
            message = 'Network error while saving code.';
        }
    }
</script>

<div class="story-box">
    <label for="code-input" class="block mb-2 label-dark">Enter your personal library code (password)</label>
    <input id="code-input" type="password" class="story-input" bind:value={codeValue} placeholder="Type the library code here" />
    <button class="story-button" onclick={submitCode}>{submitOption?.name ?? "Submit code"}</button>
    {#if message}
        <p class="mt-2 message-text">{message}</p>
    {/if}
</div>

<style>
    .label-dark { color: var(--cover-dark); }
    .message-text { color: #3a3a3a; }
</style>