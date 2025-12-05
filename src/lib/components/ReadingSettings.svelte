<script>
    import { getContext, setContext } from "svelte";
    import TypeWriter from "./TypeWriter.svelte.js";
    // import {myTypeWriter} from "./ReadingWindow.svelte";

    let readingSpeed = 5;
    // const settingsState = $state([ readingSpeed ]);
    // setContext('readingSpeed', settingsState);
    // const myTypeWriter = getContext('typewriter');
    /**
     * @type {{speed:number, myTypeWriter:TypeWriter}}
     */
    const readingSettingsContext = getContext('readingSettings');

    function handleInput() {
        // console.log('settingsState', settingsState);
        // settingsState[0] = readingSpeed;
        // setContext('readingSettings', readingSpeed);
        readingSettingsContext.myTypeWriter?.setSpeed(readingSpeed);
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