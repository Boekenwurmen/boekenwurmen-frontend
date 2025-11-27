<script>
    import { getContext } from 'svelte';
    export let action = "Default action";

    const pageContext = getContext('page');

    function setPage() {
        pageContext[0] = action.toPage;
    }
</script>

<button class="w-full border rounded-lg p-4 my-4 block" on:click={setPage}>
    {action.name}
</button>