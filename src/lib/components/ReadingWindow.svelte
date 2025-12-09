<script>
	import TypeWriter from './TypeWriter.svelte.js';
	import Stories from './Stories.svelte.js';
    import { getContext } from 'svelte';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { NAME_PAGE, INPUT_FOCUS_DELAY, WELCOME_DELAY } from '$lib/constants';
    import { createClient, advanceFromNameToCode } from '$lib/readingActions.js';

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
        if (!nameValue) return;
        const { ok, status, data } = await createClient(PUBLIC_API_URL, nameValue);
        if (status === 201 && data && data.success && data.client) {
            clientContext.id = data.client.id;
            clientContext.name = data.client.name;
            myTypeWriter.reset(`Welcome ${data.client.name}!`);
            setTimeout(() => advanceFromNameToCode(pageContext), WELCOME_DELAY);
        } else if (status === 409) {
            const msg = data?.message || 'Name already taken.';
            myTypeWriter.reset(msg);
        } else {
            const msg = data?.message || 'Could not create player. Try again.';
            myTypeWriter.reset(msg);
        }
    }

    $effect(() => {
        // snapshot primitives from proxied $state
        const page = pageContext ? Number(pageContext[0]) : undefined;
        const bookId = pageContext ? Number(pageContext[1]) : undefined;

        if (page == null) return; // nothing to do
        if (page === _lastPage) return; // already handled this page
        _lastPage = page;

        if (page === NAME_PAGE) {
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
            }, INPUT_FOCUS_DELAY);
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
    <!-- Inline box styled like story windows -->
    <div class="story-box typing">
        <p>{myTypeWriter.shown}</p>
        <div class="mt-3 w-full">
            <input class="story-input" bind:value={nameValue} placeholder="Enter your name" bind:this={nameInputEl} />
            <button class="story-button" onclick={submitName}>Submit</button>
        </div>
    </div>
{:else}
    <p class="story-box typing">{myTypeWriter.shown}</p>
{/if}