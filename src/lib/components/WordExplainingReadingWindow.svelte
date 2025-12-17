<script lang="ts">
	import WordExplainer from "./WordExplainer.svelte";
    // import Snippet from "./WordExplainer";

    const {text = "" as string} = $props();

    // $effect(() => {
    //     // snapshot primitives from proxied $state
    //     // const page = pageContext ? Number(pageContext[0]) : undefined;
    //     // const bookId = pageContext ? Number(pageContext[1]) : undefined;
    // })

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

    const initialText = $derived(text);
    const snippets:Snippet[] = [
        // {
        //     text: 'bbb',
        //     word: {
        //         word: 'myword',
        //         wordDefinition: { wordType: "znw.", definition: "dd", example: "ee" },
        //     }
        // }
    ]
</script>

{initialText}
{#each snippets as snippet}
    <WordExplainer explainer={snippet.word}/>
    {snippet.text}
{/each}