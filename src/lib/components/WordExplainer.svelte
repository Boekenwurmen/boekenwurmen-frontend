<script>
    /**
     * @typedef {Object} WordDefinition
     * @property {string} wordType - The grammatical type of the word (e.g., noun, verb, adjective)
     * @property {string} definition - The definition of the word
     * @property {string} [translation] - An optional translation of the word
     * @property {string} example - An example sentence using the word
     *
     * @typedef {Object} Word
     * @property {string} word - The word text
     * @property {WordDefinition} wordDefinition - The definition details for the word
     */

    const {
        /** @type { Word }*/
        explainer = {word: '', wordDefinition: { wordType: "", definition: "", example: "" }}
    } = $props();
    
    /** @type { WordDefinition }*/
    const definition = explainer.wordDefinition;
    const definitionText = `${definition.wordType} ${definition.translation ? `, ${definition.translation}` : ''}, ${definition.definition}, ${definition.example}`;
</script>

<abbr title="{definitionText}">{explainer.word}</abbr>