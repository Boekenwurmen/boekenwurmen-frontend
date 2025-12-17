<script lang="ts">
	import WordExplainer from "./WordExplainer.svelte";
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


    interface Split {
        beforeWord: string;
        word: string;
    }

    let myResult:Split[] = $state([]);
    $effect(() => {
        console.log('effect2');
        let previousIndex = 0;
        const tempResult:Split[] = [];
        // for (let i = 0; i < matches.length; i++) {
        //     const e = matches[i];
            
        // }

        const matches2 = [
            {startIndex: 10, endIndex: 15},
            {startIndex: 20, endIndex: 25},
            {startIndex: 30, endIndex: 35},
        ]


        // for(let e of matches2) {
        for (let i = 0; i < matches2.length +1 && previousIndex <= text.length; i++) {
            const e = matches2[i];
            tempResult.push({
                beforeWord: text.substring(previousIndex, e?.startIndex ?? text.length),
                word: !e || e?.startIndex > text.length ? '' : text.substring(e?.startIndex, e?.endIndex),
            });
            previousIndex = e?.endIndex;
        };
        console.log('tempResult', tempResult.toString(), text);
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
        <WordExplainer explainer={snippet.word}/>
    {/if}
{/each}