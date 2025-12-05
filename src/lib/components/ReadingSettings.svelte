<script>
    import { getContext, setContext } from "svelte";
    import TypeWriter from "./TypeWriter.svelte.js";

    /**
     * @type {{speed:number, myTypeWriter:TypeWriter}}
     */
    const readingSettingsContext = getContext('readingSettings');
    let readingSpeed = readingSettingsContext.speed;

    function handleInput() {
        readingSettingsContext?.myTypeWriter?.setSpeed(readingSpeed);
        readingSettingsContext.speed = readingSpeed;
    }
</script>

<div class="w-full">
    <details>
        <summary>Settings</summary>
        <div>
            <label for="readingSpeed">Reading Speed</label>
            <input type="range" id="readingSpeed" name="readingSpeed" min="1" max="10" bind:value={readingSpeed} on:input={handleInput}/>
        </div>
    </details>
</div>