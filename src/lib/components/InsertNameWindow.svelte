<script>
	import TypeWriter from './TypeWriter.svelte.js';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { INPUT_FOCUS_DELAY, WELCOME_DELAY } from '$lib/constants';
    import { createClient, advanceFromNameToCode, followOption } from '$lib/readingActions.js';
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
        const { ok, status, data } = await createClient(PUBLIC_API_URL, nameValue);
        if (status === 201 && data && data.success && data.client) {
            clientContext.id = data.client.id;
            clientContext.name = data.client.name;
            myTypeWriter.reset(`Welcome ${data.client.name}!`);
            // setTimeout(() => advanceFromNameToCode(pageContext), WELCOME_DELAY);
            setTimeout(() => followOption(pageContext, submitOption), WELCOME_DELAY);
        } else if (status === 409) {
            if (followOption(pageContext, errorOptionDuplicateName)) return;
            const msg = `The librarian says that the name is taken by somebody else, the scroll in his hand gives clues of what might happen written in codewords that can only be deciphered by the master librarians who built the library, it goes like this: "http${status} ${data?.message}". The librarian sighs and gives me an instruction "If you know the master librarians, please give them this scroll to fix the library" he says.` || 'Name already taken.';
            myTypeWriter.reset(msg);
        } else {
            if (followOption(pageContext, errorOptionUnknown)) return;
            const msg = `The librarian could not find his scroll. He did find a clue but it is written in codewords that can only be deciphered by the master librarians who built the library, it goes like this: "http${status} ${data?.message}". The librarian sighs and gives me an instruction "If you know the master librarians, please give them this scroll to fix the library" he says.` || 'Could not create player. Try again.';
            myTypeWriter.reset(msg);
        }
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