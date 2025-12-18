<script lang="ts">
	import Dictionary from "./Dictionary.svelte";
	import WordExplainer from "./WordExplainer.svelte";
	import RegexWordMatcher from "./WordMatcher.svelte";

    const {
        text = '' as string,
        completeText = '' as string,
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
    
    Dictionary.getBookList().then(list => {
        console.log('list', list)
        matcher.setRegex(list);
        matches = getMatches();
    })
    .catch(err => {
        console.error('Error loading dictionary word list', err);
    });
    // TODO export the page text promise from this component's parent and use promise.all rather than effect to set this up once

    $effect(() => {
        console.log('effect1');
        matches = getMatches();
    });

    function getMatches() {
        return matcher.split(completeText).map(e => ({ ...e, promise: Dictionary.getDefinition(e.word) }))
    }

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
            const wordDefinitionPromise = isWordComplete ? Dictionary.getDefinition(word) : null;
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