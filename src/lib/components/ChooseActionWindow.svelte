<script>
    import ChooseAction from "./ChooseAction.svelte";
    import { getContext } from 'svelte';
    import Stories from "./Stories.svelte";
    import { showDelayedLoadingMessage } from "./delayedLoadingMessage";

    const pageContext = getContext('page');
    let currentPage = $state(0);

    $effect(() => {
        // access index directly from the proxied $state - it supports numeric access
        currentPage = pageContext ? Number(pageContext[0] ?? 0) : 0;
    });

    /**
     * @type {{ toPage: number, type: string, name: string }[]}
     */
    let options = $state([]);
    let pageType = $state(
        /**@type {"page" | "enter name" | "enter password" | "set name" | "set password"}*/
        ('page')
    );

    $effect(() => {
        // snapshot primitives to avoid proxied $state usage
        const page = pageContext ? pageContext[0] : undefined;
        const bookId = pageContext ? pageContext[1] : undefined;

        // console.log('[ChooseActionWindow] page effect', { page, bookId });
                
        const optionsPromise = showDelayedLoadingMessage(
            Stories.getPageOptions(bookId, page),
            () => options = []
        );
        const typePromise = Stories.getPageType(bookId, page);

        Promise.all([optionsPromise, typePromise])
            .then(v => {[options, pageType] = v; console.log('options loaded', v[0], v[1])})
            .catch(err => {
                console.error('[ChooseActionWindow] failed getPageOptions', err);
                options = [
                    {toPage:0, type: "page", name: "Go back"},
                ];
            });
    })

</script>
    {#each options as option}
        <ChooseAction action={option}/>
    {/each}
<style>
    .label-dark { color: var(--cover-dark); }
    .message-text { color: #3a3a3a; }
</style>