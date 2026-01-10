<script lang="ts">
    import { getContext } from 'svelte';
    import { goto } from '$app/navigation';
	import { ACCOUNT_CREATION_PAGE } from '$lib/constants.ts';

    const pageContext = getContext<[number, number, number]>('page') as [number, number, number] | undefined;
    const hasSkipped = $derived(pageContext ? pageContext[0] < ACCOUNT_CREATION_PAGE : true);
    
    async function setPage() {
        if (!pageContext) {
            console.error('no page context to skip intro with');
            return;
        }
        try {
            console.log('try skip intro');
            const raw = localStorage.getItem('auth');
            const auth = raw ? JSON.parse(raw) : null;
            const isLoggedIn = auth?.loggedIn;
            console.log('try2 skip intro');
            if (isLoggedIn) {
                console.log('lib skip intro');
                goto('/library');
            } else {
                console.log('page skip intro', ACCOUNT_CREATION_PAGE);
                pageContext[0] = ACCOUNT_CREATION_PAGE;
                pageContext[2]++;
            }
        } catch {
            console.error('cant skip intro');
            return;
        }
    }
</script>

{#if hasSkipped}
<button class="story-button story-button-wide my-4" onclick={setPage}>
    Skip Intro
</button>
{/if}