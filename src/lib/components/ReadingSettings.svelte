<script>
	import { getContext, onMount, setContext } from 'svelte';
	import TypeWriter from './TypeWriter.svelte.js';

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

<div class="reading-settings">
	<div class="w-full">
		<details>
			<summary aria-label="Instellingen">⚙Instellingen</summary>
			<div>
				<label for="readingSpeed">Leessnelheid</label>
				<input
					type="range"
					id="readingSpeed"
					name="readingSpeed"
					min="5"
					max="80"
					step="5"
					bind:value={readingSpeed}
					on:input={handleReadingSpeedUpdate}
				/>
			</div>
		</details>
	</div>
</div>

<style>
    .reading-settings {
        position: absolute;
        top: -180px;
        right: 0;
        z-index: 10;
        /* keep it compact to match the exit button area */
        max-width: 280px;
    }

    .reading-settings details {
        background: transparent;
        padding: 0;
        margin: 0;
    }

    .reading-settings summary {
        cursor: pointer;
        list-style: none;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%);
        color: #6b5437;
        border: 2px solid #d4a574;
        box-shadow: 0 4px 12px rgba(107, 84, 55, 0.15);
        transition: all 0.3s ease;
    }

    .reading-settings summary:hover {
        background: linear-gradient(135deg, #8b6f47 0%, #6b5437 100%);
        color: #f5e6d3;
        border-color: #6b5437;
        box-shadow: 0 6px 16px rgba(107, 84, 55, 0.3);
        transform: translateY(-2px);
    }

    .reading-settings input[type='range'] {
        width: 200px;
    }
</style>
