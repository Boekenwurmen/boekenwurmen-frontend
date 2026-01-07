<script>
    import { getContext, onMount, setContext } from "svelte";
    import TypeWriter from "./TypeWriter.svelte.js";

    /**
     * @type {{speed:number, myTypeWriter:TypeWriter}}
     */
    const readingSettingsContext = getContext('readingSettings');
    let readingSpeed = readingSettingsContext.speed;
    
    onMount(() => {
        // when page is loaded, run set reading speed again to force the range input element to show this value
        readingSpeed = readingSettingsContext.speed;
    });

    /**
     * sets the reading speed when it changes
     */
    function handleReadingSpeedUpdate() {
        readingSettingsContext?.myTypeWriter?.setSpeed(readingSpeed);
        readingSettingsContext.speed = readingSpeed;
    }
</script>

<div class="w-full">
    <details>
        <summary>Instellingen</summary>
        <div>
            <label for="readingSpeed">Leessnelheid</label>
            <input type="range" id="readingSpeed" name="readingSpeed" min="5" max="80" step="5" bind:value={readingSpeed} on:input={handleReadingSpeedUpdate}/>
        </div>
    </details>
</div>