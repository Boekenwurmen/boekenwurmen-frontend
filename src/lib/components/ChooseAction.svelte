<script>
    import { getContext } from 'svelte';
    const { action = { toPage: 1, name: "Go back" } } = $props();

    const pageContext = getContext('page');

    // keep a reactive primitive snapshot of the current page to avoid
    // logging proxied $state objects and to allow template reactivity.
    let currentPage;
    $effect(() => {
        currentPage = pageContext ? pageContext[0] : undefined;
    });

    function setPage() {
        try {
            // take primitive snapshots so Svelte doesn't warn about proxied $state objects
            const pageSnapshot = pageContext ? pageContext[0] : undefined;
            const actionSnapshot = { toPage: Number(action?.toPage), name: String(action?.name) };
            console.log('[ChooseAction] setPage called', actionSnapshot, { page: pageSnapshot });
            if (!pageContext) {
                console.warn('[ChooseAction] pageContext is not available', pageContext);
                return;
            }
            const newPage = Number(action.toPage);
            if (Number.isNaN(newPage)) {
                console.warn('[ChooseAction] invalid toPage', action.toPage);
                return;
            }
            pageContext[0] = newPage;
        } catch (err) {
            console.error('[ChooseAction] setPage error', err);
        }
    }
</script>

{#if currentPage !== 3}
<button class="w-full border rounded-lg p-4 my-4 block hover:bg-opacity-10 hover:bg-gray-200 transition-colors" on:click={setPage}>
    {action.name}
</button>
{/if}