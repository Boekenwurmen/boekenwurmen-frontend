<script>
    import { getContext } from 'svelte';

    const pageContext = getContext('page');
    // let { x, y, size, rotate } = $props();
    
    // export let page = ['1'];
    // let text = 'empty';
    const text = $derived.by(() => {
        let page = pageContext[0];
        switch (page) {
            case 1: return 'You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story. You should read this story.'
            case 2: return 'Have you read the story?'
            default: return 'Empty'
        }
    })
</script>

<p class="max-w-2xl border rounded-lg p-4">{text}</p>