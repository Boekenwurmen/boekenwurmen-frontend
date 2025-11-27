<script>
    import ChooseAction from "./ChooseAction.svelte";
    const options = [
        'read',
        'don\'t read',
    ] 
</script>

{#each options as option}
    <ChooseAction action="{option}"/>
{/each}