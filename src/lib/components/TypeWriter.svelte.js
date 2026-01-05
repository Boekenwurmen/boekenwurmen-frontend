export default class TypeWriter {
    /** @type {number} the time to wait in milliseconds between typing each character */
    _typingDelay = 0;

    /**
     * Creates a typewriter to type out a text one letter at a time into the attribute "this.shown" with a svelte state rune
     * @param {number} [speed = 50] to type out letters by in characters per second
     * @param {string} [initialText = ''] text to show on screen before the reset method is called like "loading..."
     */
    constructor(speed = 5, initialText = '') {
        this._text = '';
        this._index = 0;
        this.setSpeed(speed);
        this._timeout = undefined;
        this.shown = $state(initialText);
        this.typeWriter = this.typeWriter.bind(this);
        this.reset = this.reset.bind(this);
    }

    /**
     * @returns The text that will be shown when the typewriter is done, this will view it before it is done.
     */
    getFinalText() {
        return this._text;
    }
    

    /**
     * Types out a text one letter at a time into the attribute "this.shown" with a svelte state rune
     */
    typeWriter() {
        if ((this._index >= this._text.length)) return;
        this.shown += this._text.charAt(this._index);
        this._index++;
        this._timeout = setTimeout(this.typeWriter.bind(this), this._typingDelay);
    }

    /**
     * @param {string} message to show until reset is called
     */
    showLoadingMessage(message = 'Loading...') {
        this.clear();
        this.shown = message;
    }
    
    /**
     * Resets the typewriter with a new text so that it clears the previous text and starts over.
     * @param {string} [text]
     */
    reset(text) {
        if (text) {
            this._text = text;
        }
        this.clear();
        this.typeWriter();
    }
    
    /**
     * stops the typing animation and clears the text
     */
    clear() {
        this._index = 0;
        this.shown = '';
        if (this._timeout) clearTimeout(this._timeout);
    }

    /**
     * @param {number} speed to type out letters by in characters per second
     */
    setSpeed(speed) {
        if (isNaN(speed) || speed <= 0) {
            this._typingDelay = 0;
            return;    
        }
        const speedCalibrationFactor = 1000;
        this._typingDelay = speed != 0 ? speedCalibrationFactor / speed : 0;
    }
}