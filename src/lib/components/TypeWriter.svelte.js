export default class TypeWriter {
    /**
     * 
     * @param {number} [speed = 5]  words per minute
     * @param {string} [initialText = ''] text to show on screen before it starts
     */
    constructor(speed = 5, initialText = '') {
        this._text = '';
        this._index = 0;
        const speedCalibrationFactor = 100;
        /** @type {number} The speed/duration of the effect in milliseconds */
        this._speed = speed != 0 ? speedCalibrationFactor / speed : 0;
        this._timeout = undefined;
        this.shown = $state(initialText);
        this.typeWriter = this.typeWriter.bind(this);
        this.reset = this.reset.bind(this);
    }
    
    typeWriter() {
        if ((this._index >= this._text.length)) return;
        this.shown += this._text.charAt(this._index);
        this._index++;
        this._timeout = setTimeout(this.typeWriter.bind(this), this._speed);
    }
    
    /**
     * 
     * @param {string} text
     */
    reset(text) {
        if (text) {
            this._text = text;
        }
        this._index = 0;
        this.shown = '';
        if (this._timeout) clearTimeout(this._timeout);
        this.typeWriter();
    }
}