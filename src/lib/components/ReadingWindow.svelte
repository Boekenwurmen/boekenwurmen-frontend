<script>
	import TypeWriter from './TypeWriter.svelte.js';
	import Stories from './Stories.svelte.js';
    import { getContext } from 'svelte';
    import { PUBLIC_API_URL } from '$env/static/public';

    /**
     * @type {number[]}
     */
    const pageContext = getContext('page');
    const clientContext = getContext('client');
    const myTypeWriter = new TypeWriter(5, 'loading...');

    // Guard to avoid repeated fetches or re-entrancy when page doesn't change
    /** @type {number | undefined} */
    let _lastPage = undefined;
    // primitive snapshot of current page for template/reactivity
    /** @type {number | undefined} */
    let currentPage = $state(undefined);
    $effect(() => {
        currentPage = pageContext ? pageContext[0] : undefined;
    });
    
    let nameValue = $state('');
    /** @type {HTMLInputElement | null} */
    let nameInputEl = $state(null);

    async function submitName() {
        const page = pageContext ? pageContext[0] : undefined;
        const bookId = pageContext ? pageContext[1] : undefined;
        if (!nameValue) return;
        try {
            const res = await fetch(`${PUBLIC_API_URL}/clients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nameValue })
            });
                const data = await res.json();
                if (res.status === 201 && data && data.success && data.client) {
                    clientContext.id = data.client.id;
                    clientContext.name = data.client.name;
                    myTypeWriter.reset(`Welcome ${data.client.name}!`);
                    // show welcome, then jump directly to the code request page after a short delay
                    setTimeout(() => {
                        try {
                            pageContext[0] = (Number(page) || 0) + 2; // jump to code page
                        } catch (e) {
                            console.error('advanceToCode', e);
                        }
                    }, 1400);
                } else if (res.status === 409) {
                    // name conflict
                    const msg = data?.message || 'Name already taken.';
                    myTypeWriter.reset(msg);
                } else {
                    const msg = data?.message || 'Could not create player. Try again.';
                    myTypeWriter.reset(msg);
                }
        } catch (err) {
            myTypeWriter.reset('Network error while creating player.');
        }
    }

    $effect(() => {
        // snapshot primitives from proxied $state
        const page = pageContext ? Number(pageContext[0]) : undefined;
        const bookId = pageContext ? Number(pageContext[1]) : undefined;

        if (page == null) return; // nothing to do
        if (page === _lastPage) return; // already handled this page
        _lastPage = page;

        if (page === 3) {
            // show prompt to ask for name; reset typing to prompt
            myTypeWriter.reset('What is your name?');
            // focus the input shortly after the prompt is shown
            setTimeout(() => {
                try {
                    nameInputEl?.focus();
                    nameInputEl?.select();
                } catch (e) {
                    // ignore
                }
            }, 50);
            return;
        }

        // fetch the story for this page
        Stories.getPageStory(bookId, page).then(story => {
            myTypeWriter.reset(story);
        }).catch(err => {
            // on error, show fallback text but avoid throwing
            myTypeWriter.reset('Failed to load story.');
            console.error('Error loading story for page', page, err);
        });
    })
</script>

{#if currentPage === 3}
    <!-- Inline box in the same style as story windows (original look) -->
    <div class="w-full border rounded-lg p-4 typing">
        <p>{myTypeWriter.shown}</p>
        <div class="mt-3">
            <input class="border rounded p-2 w-full" bind:value={nameValue} placeholder="Enter your name" bind:this={nameInputEl} />
            <button class="mt-2 px-4 py-2 bg-blue-600 text-white rounded" on:click={submitName}>Submit</button>
        </div>
    </div>
{:else}
    <p class="w-full border rounded-lg p-4 typing">{myTypeWriter.shown}</p>
{/if}