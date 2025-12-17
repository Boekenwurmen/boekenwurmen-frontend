<script>
	import TypeWriter from './TypeWriter.svelte.js';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { INPUT_FOCUS_DELAY, WELCOME_DELAY } from '$lib/constants';
    import { advanceFromNameToCode, followOption } from '$lib/readingActions.js';
    import { getContext } from 'svelte';
	import { showDelayedLoadingMessage } from './delayedLoadingMessage.js';
	import Stories from './Stories.svelte.js';
	import { derived } from 'svelte/store';
    
    /**
     * @type {{speed:number, myTypeWriter:TypeWriter}}
     */
    const readingSettingsContext = getContext('readingSettings');
    const readingSpeed = readingSettingsContext.speed;

    /**
     * @type {number[]}
     */
    const pageContext = getContext('page');
    const clientContext = getContext('client');
    const myTypeWriter = new TypeWriter(readingSpeed, 'Loading...');
    readingSettingsContext.myTypeWriter = myTypeWriter;

    // Guard to avoid repeated fetches or re-entrancy when page doesn't change
    /** @type {number | undefined} */
    let _lastPage = undefined;
    // primitive snapshot of current page for template/reactivity
        
    let nameValue = $state('');
    /** @type {HTMLInputElement | null} */
    let nameInputEl = $state(null);
    /**
     * @type {{ toPage: number, type: string, name: string }[]}
     */
    let options = $state([]);
    const submitOption = $derived(options.find(opt => opt.type === "submit"));
    const errorOptions = $derived(options.filter(opt => opt.type === "onError"));
    const errorOptionDuplicateName = $derived(errorOptions.find(opt => opt.name === "name exists already"));
    const errorOptionUnknown = $derived(errorOptions.find(opt => opt.name === "service unavailable"));

    async function submitName() {
        if (!nameValue) return;
        // Do not create the account yet; just store the name locally.
        clientContext.name = nameValue.trim();
        myTypeWriter.reset(`Welcome ${clientContext.name}!`);
        setTimeout(() => followOption(pageContext, submitOption), WELCOME_DELAY);
    }

    $effect(() => {
        // snapshot primitives from proxied $state
        const page = pageContext ? Number(pageContext[0]) : undefined;
        const bookId = pageContext ? Number(pageContext[1]) : undefined;

        if (page == null) return; // nothing to do
        if (page === _lastPage) return; // already handled this page
        _lastPage = page;

        // show prompt to ask for name; reset typing to prompt
        myTypeWriter.reset('What is your name?');
        // focus the input shortly after the prompt is shown
        setTimeout(() => {
            try {
                nameInputEl?.focus();
                nameInputEl?.select();
            } catch (e) {
                // ignore
            }
        }, INPUT_FOCUS_DELAY);

        const optionsPromise = showDelayedLoadingMessage(
            Stories.getPageOptions(bookId, page),
            () => options = []
        );

        optionsPromise.then(v => options = v)
            .catch(err => {
                console.error('[ChooseActionWindow] failed getPageOptions', err);
                options = [
                    {toPage:0, type: "page", name: "Go back"},
                ];
            });
    })
</script>

<!-- Inline box styled like story windows -->
<div class="story-box typing">
    <p>{myTypeWriter.shown}</p>
    <div class="mt-3 w-full">
        <input class="story-input" bind:value={nameValue} placeholder="Enter your name" bind:this={nameInputEl} />
        <button class="story-button" onclick={submitName}>{submitOption?.name ?? "Submit"}</button>
    </div>
</div>