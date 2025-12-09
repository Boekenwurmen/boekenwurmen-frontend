<script>
    import { getContext } from 'svelte';
    export let action = {toPage:1, name:"Go back"};

    /**
     * @type {{pageId:number,bookId:number}}
     */
    const pageContext = getContext('page');

    function setPage() {
        pageContext.pageId = action.toPage;
    }
</script>

<button class="w-full border rounded-lg p-4 my-4 block hover:bg-opacity-10 hover:bg-gray-200 transition-colors" on:click={setPage}>
    {action.name}
</button>