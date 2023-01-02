Game.Map = class {
    constructor(tiles, player) {
        this._tiles = tiles;
        this._width = tiles.length;
        this._height = tiles[0].length;
        this._entities = [];
        this._scheduler = new ROT.Scheduler.Simple();
        this._engine = new ROT.Engine(this._scheduler);
        //add the player
        this.addEntityRandomPosition(player);
        //add random Fungus to map
        for (let i = 0; i < 1000; i++) {
            this.addEntityRandomPosition(new Game.Entity(Game.FungusTemplate));
        }
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get engine() {
        return this._engine;
    }
    get entities() {
        return this._entities;
    }

    getTile(x, y) {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return Game.Tile.nullTile;
        } else {
            return this._tiles[x][y] || Game.Tile.nullTile;
        }
    }
    dig(x, y) {
        if (this.getTile(x, y).isDiggable) {
            this._tiles[x][y] = Game.Tile.floorTile;
        }
    }
    getRandomFloorPosition() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this._width);
            y = Math.floor(Math.random() * this._height);
        } while(this.getTile(x, y) !== Game.Tile.floorTile || this.getEntityLocation(x, y));
        return {x: x, y: y};
    }
    addEntity(ent) {
        if (ent.x < 0 || ent.x >= this._width ||
            ent.y < 0 || ent.y >= this._height) {
                throw new Error ('adding entity out of bounds');
            }
        //update entities map
        ent.map = this;
        //add entity to entity list
        this._entities.push(ent);
        //if entity is an actor -- add it to scheduler
        if (ent.hasAddOn('actor')) {
            this._scheduler.add(ent, true);
        }
    }
    addEntityRandomPosition(ent) {
        const position = this.getRandomFloorPosition();
        ent.x = position.x;
        ent.y = position.y;
        this.addEntity(ent);
    }
    getEntityLocation(x, y) {
        //find entities at given position
        // for (let i = 0; i < this._entities.length; i++) {
        //     if (this._entities[i].x === x && this._entities[i].y === y) {
        //         return this._entities[i];
        //     }
        // }
        return this._entities.find(ent => {
            return ent.x === x && ent.y === y
        });
    }
}