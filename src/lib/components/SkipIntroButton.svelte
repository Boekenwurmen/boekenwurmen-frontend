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

<!-- class="story-button story-button-wide my-4" -->
{#if hasSkipped}
<button class="skip-button" onclick={setPage}>
    Skip Intro
</button>
{/if}

<style>
    
	.skip-button {
		position: absolute;
		top: -180px;
		left: 0;
		background: linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%);
		color: #6b5437;
		border: 2px solid #d4a574;
		border-radius: 10%;
		font-size: 24px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		z-index: 10;
		box-shadow: 0 4px 12px rgba(107, 84, 55, 0.15);
		font-weight: bold;
	}

	.skip-button:hover {
		background: linear-gradient(135deg, #8b6f47 0%, #6b5437 100%);
		color: #f5e6d3;
		border-color: #6b5437;
		box-shadow: 0 6px 16px rgba(107, 84, 55, 0.3);
		transform: translateY(-2px);
	}

	.skip-button:active {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(107, 84, 55, 0.2);
	}
</style>