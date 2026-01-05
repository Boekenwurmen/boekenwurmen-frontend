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

    const {
        explainer = '' as string,
        promise = null as Promise<Object>|null,
    } = $props();
    const definition:WordDefinition = { wordType: '', definition: '', example: '' }
    let definitionText = $state('');

    promise?.then(definition => {
        definitionText = getDefinitionString(definition as WordDefinition);
    })
    ?.catch(err => {
        console.error('Error loading dictionary word list', err);
    });

    
    function getDefinitionString(definition:WordDefinition) {
        return `Woordsoort: ${definition.wordType} ${definition.translation ? `Vertaling: ${definition.translation}` : ''} Definitie: ${definition.definition} Voorbeeld: ${definition.example}`;
    }
</script>

<abbr title="{definitionText}">{explainer}</abbr>