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

Game.randomizeArray = function(arr) {
    arr.sort(() => Math.random() - 0.5);
    return arr;
}

Game.getNeighborPositions = function(x, y) {
    let tiles = [];
    for (let dx = -1; dx < 2; dx++) {
        for (let dy = -1; dy < 2; dy++) {
            if (dx === 0 && dy === 0) {
                continue;
            }
            tiles.push({x: x + dx, y: y + dy});
        }      
    }
    return Game.randomizeArray(tiles);
}

Game.Tile.nullTile = new Game.Tile({});
Game.Tile.floorTile = new Game.Tile({char: '.', isWalkable: true});
Game.Tile.wallTile = new Game.Tile({char: '#', foreground: 'goldenrod', isDiggable: true});
Game.Tile.stairsUpTile = new Game.Tile({char: '<', foreground: 'white', isWalkable: true});
Game.Tile.stairsDownTile = new Game.Tile({char: '>', foreground: 'white', isWalkable: true});


