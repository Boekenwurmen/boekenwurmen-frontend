<script lang="ts">
	import Dictionary from "./Dictionary.svelte";
	import WordExplainer from "./WordExplainer.svelte";
	import RegexWordMatcher from "./WordMatcher.svelte";

    const {
        text = '' as string,
        storyPromise = null as Promise<string>|null,
    } = $props();

    interface WordDefinition {
        wordType: string;
        definition: string;
        example: string;
    }

    interface Word {
        word: string;
        wordDefinition: WordDefinition;
    }

    interface Snippet {
        text: string;
        word: Word;
    }

    interface Match {
        startIndex: number;
        endIndex: number;
        word: string;
        wordDefinitionPromise: Promise<Object> | null;
    }

    interface Split {
        beforeWord: string;
        word: string;
        isWordComplete: boolean;
        wordDefinitionPromise: Promise<Object> | null;
    }

    let matches:Match[] = $state([]);
    let myResult:Split[] = $state([]);
    const matcher = new RegexWordMatcher([]);


    // should trigger on each new page
    $effect(() => {
        console.log('storyPromise', storyPromise);
        if (storyPromise) {
            const wordListPromise = Dictionary.getBookList();
            Promise.all([storyPromise, wordListPromise]).then(getMatches)
            .catch(err => {
                console.error('Error loading dictionary word list', err);
            });
        } else {
            console.error('Error loading dictionary word list', 'no story promise');
        }
    });

    function getMatches(resolutions:[string, string[]]) {
        const [completeText, bookList] = resolutions;
        console.log('getmatches', completeText, bookList);
        matcher.setRegex(bookList);
        matches = matcher.split(completeText).map(e => ({ ...e, wordDefinitionPromise: Dictionary.getDefinition(e.word) }))
        console.log('list', bookList, completeText, matches);
    }

    // should trigger on each of typewriter's typed characters
    $effect(() => {
        console.log('effect2');
        let previousIndex = 0;
        const tempResult:Split[] = [];

        const matches2 = matches;

        for (let i = 0; i < matches2.length +1 && previousIndex <= text.length; i++) {
            const e = matches2[i];
            const beforeWord = text.substring(previousIndex, e?.startIndex ?? text.length);
            const word = !e || e?.startIndex > text.length ? '' : text.substring(e?.startIndex, e?.endIndex);
            const isWordComplete = e && e?.endIndex <= text.length;
            const wordDefinitionPromise = isWordComplete ? e.wordDefinitionPromise : null;
            tempResult.push({ beforeWord, word, isWordComplete, wordDefinitionPromise });
            previousIndex = e?.endIndex;
        };
        myResult = tempResult;
    });
</script>

{#each myResult as snippet}
    {snippet.beforeWord ?? ''}
    {#if snippet.word}
        {#if snippet.isWordComplete}
            <WordExplainer explainer={snippet.word} promise={snippet.wordDefinitionPromise}/>
        {:else}
            {snippet.word}
        {/if}
    {/if}
{/each}