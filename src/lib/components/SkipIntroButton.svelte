<script lang="ts">
    import { getContext } from 'svelte';
    import { goto } from '$app/navigation';
	import { ACCOUNT_CREATION_PAGE } from '$lib/constants';

    const pageContext = getContext<[number, number, number]>('page') as [number, number, number] | undefined;
    
    async function setPage() {
        if (!pageContext) {
            return;
        }
        try {
            const raw = localStorage.getItem('auth');
            const auth = raw ? JSON.parse(raw) : null;
            const isLoggedIn = auth?.loggedIn;
            if (isLoggedIn) {
                goto('/library');
            } else {
                pageContext[0] = ACCOUNT_CREATION_PAGE;
            }
        } catch {
            return;
        }
    }
</script>

<button class="story-button story-button-wide my-4" onclick={setPage}>
    Skip Intro
</button>