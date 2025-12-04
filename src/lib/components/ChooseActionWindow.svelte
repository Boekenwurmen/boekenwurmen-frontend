<script>
     import ChooseAction from "./ChooseAction.svelte";
     import { getContext } from 'svelte';
     import Stories from "./Stories.svelte";
     import { PUBLIC_API_URL } from '$env/static/public';

     const pageContext = getContext('page');
     const clientContext = getContext('client');
    let currentPage = $state(0);
    $effect(() => {
        // access index directly from the proxied $state - it supports numeric access
        currentPage = pageContext ? Number(pageContext[0] ?? 0) : 0;
    });

    /**
     * @type {{ toPage: number, name: string }[]}
     */
    let options = $state([]);

        let codeValue = '';
        let message = '';

        $effect(() => {
            // snapshot primitives to avoid proxied $state usage
            const page = pageContext ? pageContext[0] : undefined;
            const bookId = pageContext ? pageContext[1] : undefined;

            // always clear options when page is 3 (name) or 5 (code)
            if (page === 3 || page === 5) {
                options = [];
            }

            // when page is 5, prefill code and do NOT fetch options
            if (page === 5) {
                (async () => {
                    try {
                        if (clientContext && clientContext.id) {
                            const res = await fetch(`${PUBLIC_API_URL}/clients/${clientContext.id}`);
                            const d = await res.json();
                            if (d && d.success && d.client && d.client.code) {
                                codeValue = d.client.code;
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
                options = [];
            });
        })

        async function submitCode() {
            message = '';
            if (!codeValue) return;
            try {
                console.log('[ChooseActionWindow] submitCode start', { codeValue, clientContext });
                // ensure client exists
                if (!clientContext.id) {
                    // try creating a guest client if none exists
                    const createRes = await fetch(`${PUBLIC_API_URL}/clients`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: clientContext.name || 'guest' })
                    });
                    const createData = await createRes.json();
                    if (createData && createData.success && createData.client) {
                        clientContext.id = createData.client.id;
                        clientContext.name = createData.client.name;
                    }
                }

                if (!clientContext.id) {
                    message = 'No client id available. Could not save code.';
                    return;
                }

                const res = await fetch(`${PUBLIC_API_URL}/clients/${clientContext.id}`, {
                    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: codeValue })
                });
                const data = await res.json();
                if (data && data.success) {
                    message = 'Code saved. Thank you!';
                    // reflect saved value from server
                    if (data.client && data.client.code) {
                        codeValue = data.client.code;
                    }
                    // fetch fresh client object to confirm in DB and show id
                    try {
                        const verifyRes = await fetch(`${PUBLIC_API_URL}/clients/${clientContext.id}`);
                        const verifyJson = await verifyRes.json();
                        console.log('[ChooseActionWindow] verify client after save', verifyJson);
                        if (verifyJson && verifyJson.success && verifyJson.client) {
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
                    console.warn('[ChooseActionWindow] save code response', data);
                }
            } catch (err) {
                console.error('[ChooseActionWindow] submitCode error', err);
                message = 'Network error while saving code.';
            }
        }
</script>

    {#if currentPage === 5}
        <div class="story-box">
            <label class="block mb-2" style="color: var(--cover-dark)">Enter the library code (password)</label>
            <input type="password" class="story-input" bind:value={codeValue} placeholder="Type the library code here" />
            <button class="story-button" on:click={submitCode}>Submit code</button>
            {#if message}
                <p class="mt-2" style="color:#3a3a3a">{message}</p>
            {/if}
        </div>
    {:else if currentPage === 3}
        <!-- when on the name prompt page we intentionally render no choices -->
        <div />
    {:else}
        {#each options as option}
            <ChooseAction action={option}/>
        {/each}
    {/if}