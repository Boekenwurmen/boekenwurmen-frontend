<script lang="ts">
    interface WordDefinition {
        wordType: string;
        definition: string;
        translation?: string;
        example: string;
    }

    interface Word {
        word: string;
        wordDefinition: WordDefinition;
    }

    // const {
    //     explainer = {word: '', wordDefinition: { wordType: '', definition: '', example: '' }} as Word
    // } = $props();
    // const definition: WordDefinition = explainer.wordDefinition;

    const { explainer = '' as string } = $props();
    const definition:WordDefinition = { wordType: '', definition: '', example: '' }
    const definitionText = `${definition.wordType} ${definition.translation ? `, ${definition.translation}` : ''}, ${definition.definition}, ${definition.example}`;
</script>

<abbr title="{definitionText}">{explainer}</abbr>