export default class TypeWriter {
    /** @type {number} the time to wait in milliseconds between typing each character, can be set using the setSpeed() method */
    _typingDelay = 0;

    /** @type {number} the factor to multiply with _typingDelay for the time to wait between typing each space character */
    _spaceTypingDelayFactor = 1;

    /** @type {number} the factor to multiply with _typingDelay for the time to wait between typing each comma character */
    _commaTypingDelayFactor = 10;

    /** @type {number} the factor to multiply with _typingDelay for the time to wait between typing each period character */
    _periodTypingDelayFactor = 20;

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
        const currentCharacter = this._getCharacterAtIndex(this._index);
        this.shown += currentCharacter;
        this._index++;
        this._timeout = setTimeout(this.typeWriter.bind(this), this._getCharacterDelay(currentCharacter));
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
     * @param {string} text
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
        const secondInMilliseconds = 1000;
        this._typingDelay = speed != 0 ? secondInMilliseconds / speed : 0;
    }

    /**
     * Gets a character from this._text at a given index.
     * @param {number} index to get the character at, index starts at 0.
     * @returns {string} a single character
     */
    _getCharacterAtIndex(index) {
        return this._text.charAt(index);
    }

    /**
     * 
     * @param {string} character a single character
     * @returns 
     */
    _getCharacterDelay(character) {
        switch (character) {
            case ' ': return this._typingDelay * this._spaceTypingDelayFactor;
            case ',': return this._typingDelay * this._commaTypingDelayFactor;
            case '.': return this._typingDelay * this._periodTypingDelayFactor;
            default: return this._typingDelay;
        }
    }
}