<script lang="ts">
	import Dictionary from "./Dictionary.svelte";

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

    const { explainer = '' as string } = $props();
    const definition:WordDefinition = { wordType: '', definition: '', example: '' }
    let definitionText = $state('');

    Dictionary.getDefinition(explainer).then(definition => {
        console.log('definition', explainer, definition);
        definitionText = getDefinitionString(definition as WordDefinition);
    })
    .catch(err => {
        console.error('Error loading dictionary word list', err);
    });

    
    function getDefinitionString(definition:WordDefinition) {
        return `${definition.wordType} ${definition.translation ? `, ${definition.translation}` : ''}, ${definition.definition}, ${definition.example}`;
    }
</script>

<abbr title="{definitionText}">{explainer}</abbr>