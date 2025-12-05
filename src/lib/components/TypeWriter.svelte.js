export default class TypeWriter {
    /** @type {number} The speed/duration of the effect in milliseconds */
    _speed = 0;

    /**
     * 
     * @param {number} [speed = 5]  words per minute
     * @param {string} [initialText = ''] text to show on screen before it starts
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
    
    typeWriter() {
        console.log('typing at speed', this._speed);
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

    /**
     * 
     * @param {number} speed 
     */
    setSpeed(speed) {
        const speedCalibrationFactor = 100;
        this._speed = speed != 0 ? speedCalibrationFactor / speed : 0;
        console.log('set speed to', this._speed);
    }
}