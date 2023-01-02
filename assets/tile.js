// Game.Tile = function(glyph) {
//     this._glyph = glyph;
// };
// Game.Tile.prototype.getGlyph = function() {
//     return this._glyph;
// }

// Game.Tile = class {
//     constructor(glyph) {
//         this._glyph = glyph;
//     }
//     getGlyph() {
//         return this._glyph;
//     }
// }

Game.Tile = class extends Game.Glyph {

    constructor(props) {
        super(props);
        this._isWalkable = props['isWalkable'] || false;
        this._isDiggable = props['isDiggable'] || false;
    }
    get isWalkable() {
        return this._isWalkable;
    }
    get isDiggable() {
        return this._isDiggable;
    }
}

// class Tile {
//     constructor(glyph) {
//         this._glyph = glyph;
//     }
//     getGlyph() {
//         return this._glyph;
//     }
// }

Game.Tile.nullTile = new Game.Tile({});
Game.Tile.floorTile = new Game.Tile({char: '.', isWalkable: true});
Game.Tile.wallTile = new Game.Tile({char: '#', foreground: 'goldenrod', isDiggable: true});


