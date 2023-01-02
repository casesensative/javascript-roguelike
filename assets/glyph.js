// Game.Glyph = function(chr, foreground, background) {
//     this._char = chr || ' ';
//     this._foreground = foreground || 'white';
//     this._background = background || 'black';
// };

// Game.Glyph.prototype.getChar = function() {
//     return this._char;
// };
// Game.Glyph.prototype.getBackground = function() {
//     return this._background;
// };
// Game.Glyph.prototype.getForeground = function() {
//     return this._foreground;
// };



Game.Glyph = class {
    constructor(props = {}) {
        this._char = props['char'] || ' ';
        this._foreground = props['foreground'] || 'white';
        this._background = props['background'] || 'black'
    }
    get char() {
        return this._char;
    }
    get background() {
        return this._background;
    }
    get foreground() {
        return this._foreground;
    }
}

// class Glyph {
//     constructor(chr, foreground, background) {
//         this._char = chr || ' ';
//         this._foreground = foreground || 'white';
//         this._background = background || 'black'
//     }
//     getChar() {
//         return this._char;
//     }
//     getBackground() {
//         return this._background;
//     }
//     getForeground() {
//         return this._foreground;
//     }
// }