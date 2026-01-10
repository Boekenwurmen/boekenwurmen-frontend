<script lang="ts">
    import { getContext } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { saveProgressToBackend } from '../readingActions';

    interface Action {
        toPage: number;
        type: "page" | "bad ending" | "ending" | "to library" | "submit" | "onError" | "to login";
        name: string;
    }
    
    const { 
        action = { toPage: 0, type: 'page', name: 'Go back' } as Action
    } = $props();

    // type context as a single-number tuple (or undefined when not provided)
    const pageContext = getContext<[number, number, number]>('page') as [number, number, number] | undefined;
    const client = getContext<{id: number | null, name: string | null}>('client');

    // keep a reactive primitive snapshot of the current page to avoid
    // logging proxied $state objects and to allow template reactivity.
    let currentPage = $state<number | undefined>(undefined);
    $effect(() => {
        currentPage = pageContext ? pageContext[0] : undefined;
    });

    async function setPage() {
        try {
            console.log('[ChooseAction] setPage called with action:', action);
            
            switch (action.type) {
                case "to library": case "ending":
                    goto('/library');
                    return;
                case "to login":
                    goto('/login');
                    return;
            }
            if (!pageContext) {
                console.warn('[ChooseAction] pageContext is not available', pageContext);
                return;
            }
            const newPage = Number(action.toPage);
            if (Number.isNaN(newPage)) {
                console.warn('[ChooseAction] invalid toPage', action.toPage);
                return;
            }
            
            console.log('[ChooseAction] Updating page to:', newPage, 'Client:', client?.id, 'Book:', pageContext[1]);
            
            // Update local state
            pageContext[0] = newPage;
            pageContext[2]++;
            
            // Save to backend
            if (client?.id && pageContext[1]) {
                const baseUrl = $page.url.origin;
                console.log('[ChooseAction] Saving to backend:', { baseUrl, clientId: client.id, bookId: pageContext[1], pageId: newPage });
                const result = await saveProgressToBackend(baseUrl, client.id, pageContext[1], newPage);
                console.log('[ChooseAction] Backend response:', result);
            } else {
                console.warn('[ChooseAction] Cannot save - missing client.id or bookId', { clientId: client?.id, bookId: pageContext[1] });
            }
        } catch (err) {
            console.error('[ChooseAction] setPage error', err);
        }
    }
</script>

<button class="story-button story-button-wide my-4" onclick={setPage}>
    {action.name}
</button>