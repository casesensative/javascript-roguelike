Game.Map = class {
    constructor(tiles) {
        this._tiles = tiles;
        this._width = tiles.length;
        this._height = tiles[0].length;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    getTile(x, y) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return Game.Tile.nullTile;
        } else {
            return this._tiles[x][y] || Game.Tile.nullTile;
        }
    }
}