<script lang="ts">
	import Dictionary from "./Dictionary.svelte";
	import WordExplainer from "./WordExplainer.svelte";
	import RegexWordMatcher from "./WordMatcher.svelte";
    // import Snippet from "./WordExplainer";

    const {
        text = '' as string,
        completeText = '' as string,
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
    }

    let matches:Match[] = $state([]);
    let myResult:Split[] = $state([]);
    // const dictionaryWords = ["sandy", "wind", "eyes"];
    const matcher = new RegexWordMatcher([]);
    
    Dictionary.getBookList().then(list => {
        console.log('list', list)
        matcher.setRegex(list);
        matches = matcher.split(completeText);
    })
    .catch(err => {
        console.error('Error loading dictionary word list', err);
    });

    $effect(() => {
        console.log('effect1');
        matches = matcher.split(completeText);
        // console.log('matches23', matches, completeText);
    });

    $effect(() => {
        console.log('effect2');
        let previousIndex = 0;
        const tempResult:Split[] = [];
        // for (let i = 0; i < matches.length; i++) {
        //     const e = matches[i];
            
        // }

        // const matches2 = [
        //     {startIndex: 10, endIndex: 15},
        //     {startIndex: 20, endIndex: 25},
        //     {startIndex: 30, endIndex: 35},
        // ]

        const matches2 = matches;

        // for(let e of matches2) {
        for (let i = 0; i < matches2.length +1 && previousIndex <= text.length; i++) {
            const e = matches2[i];
            tempResult.push({
                beforeWord: text.substring(previousIndex, e?.startIndex ?? text.length),
                word: !e || e?.startIndex > text.length ? '' : text.substring(e?.startIndex, e?.endIndex),
                isWordComplete: e && e?.endIndex <= text.length,
            });
            previousIndex = e?.endIndex;
        };
        // console.log('tempResult', tempResult.toString(), text);
        myResult = tempResult;
    });
    // const initialText = $derived(text);
    // const snippets: Snippet[] = [
    //     // {
    //     //     text: 'bbb',
    //     //     word: {
    //     //         word: 'myword',
    //     //         wordDefinition: { wordType: "znw.", definition: "dd", example: "ee" },
    //     //     }
    //     // }
    // ]
</script>

<!-- {initialText} -->
{#each myResult as snippet}
    {snippet.beforeWord ?? ''}
    {#if snippet.word}
        {#if snippet.isWordComplete}
            <WordExplainer explainer={snippet.word}/>
        {:else}
            {snippet.word}
        {/if}
    {/if}
{/each}