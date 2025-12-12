<script lang="ts">
    import { getContext } from 'svelte';
    const { 
        action = { toPage: 0, type: 'page', name: 'Go back' } as { toPage: number; type: "page" | "bad ending" | "ending" | "to library" | "submit" | "onError"; name: string; }
    } = $props();

    // type context as a single-number tuple (or undefined when not provided)
    const pageContext = getContext<[number]>('page') as [number] | undefined;

    // keep a reactive primitive snapshot of the current page to avoid
    // logging proxied $state objects and to allow template reactivity.
    let currentPage = $state<number | undefined>(undefined);
    $effect(() => {
        currentPage = pageContext ? pageContext[0] : undefined;
    });

    function setPage() {
        try {
            const pageSnapshot = pageContext ? pageContext[0] : undefined;
            const actionSnapshot = { toPage: Number(action?.toPage), name: String(action?.name) };
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

<button class="story-button story-button-wide my-4" onclick={setPage}>
    {action.name}
</button>