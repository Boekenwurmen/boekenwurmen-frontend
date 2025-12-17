<script>
	import WordExplainer from "./WordExplainer.svelte";
    // import Snippet from "./WordExplainer";

    const {/** @type { string }*/ text = ""} = $props();

    // $effect(() => {
    //     // snapshot primitives from proxied $state
    //     // const page = pageContext ? Number(pageContext[0]) : undefined;
    //     // const bookId = pageContext ? Number(pageContext[1]) : undefined;
    // })

    /**
     * @typedef {Object} WordDefinition
     * @property {string} wordType - The grammatical type of the word (e.g., noun, verb, adjective)
     * @property {string} definition - The definition of the word
     * @property {string} example - An example sentence using the word
     *
     * @typedef {Object} Word
     * @property {string} word - The word text
     * @property {WordDefinition} wordDefinition - The definition details for the word
     *
     * @typedef {Object} Snippet
     * @property {string} text - The full text snippet or passage
     * @property {Word} word - The word object containing the word and its definition
     */

    const initialText = $derived(text);
    /**
     * @type {Snippet[]}
     */
    const snippets = [
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