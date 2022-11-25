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

Game.Tile = class {
    constructor(glyph) {
        this._glyph = glyph;
    }
    get glyph() {
        return this._glyph;
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

Game.Tile.nullTile = new Game.Tile(new Game.Glyph());
Game.Tile.floorTile = new Game.Tile(new Game.Glyph('.'));
Game.Tile.wallTile = new Game.Tile(new Game.Glyph('#', 'goldenrod'));

console.log('Game.Tile -- ', Game.Tile);
console.log('Game.Tile.floorTile -- ', Game.Tile.floorTile);
console.log('Game', Game);
