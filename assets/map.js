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
        // add random Fungus to map
        for (let i = 0; i < 100; i++) {
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
        } while (!this.isEmptyTile(x, y));
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
    removeEntity(ent) {
        const index = this._entities.findIndex(e => e === ent);
        if (index >= 0) {
            this._entities.splice(index, 1);
            if (ent.hasAddOn('actor')) {
                this._scheduler.remove(ent)
            };
        };
    }
    isEmptyTile(x, y) {
        //check if the tile is floor and has no entity
        return this.getTile(x, y) === Game.Tile.floorTile && 
            !this.getEntityLocation(x, y);
    }
    addEntityRandomPosition(ent) {
        console.log('FUNGUS TO ADD:::', ent);
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
    getEntitiesInRadius(cx, cy, radius) {
        let results = [];
        const leftx = cx - radius;
        const rightx = cx + radius;
        const topy = cy - radius;
        const boty = cy + radius;
        for (let i = 0; i < this._entities.length; i++) {
            if (this._entities[i].x >= leftx &&
                this._entities[i].x <= rightx &&
                this._entities[i].y >= topy &&
                this._entities[i].y <= boty) {
                    results.push(this._entities[i]);
                }            
        }
        return results;
    }
}