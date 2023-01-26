Game.Builder = class {
    constructor(w, h, d) {
        this._width = w;
        this._height = h;
        this._depth = d;
        this._tiles = new Array(d);
        this._regions = new Array(d);
        //make the arrays multi-dimensional
        for (let z = 0; z < d; z++) {
            //create a new cave at each level
            this._tiles[z] = this.generateLevel();
            //set up regions array for each depth
            this._regions[z] = new Array(w);
            for (let x = 0; x < w; x++) {
                this._regions[z][x] = new Array(h);
                //fill with zeros
                for (let y = 0; y < h; y++) {
                    this._regions[z][x][y] = 0;                    
                }                
            }            
        }

        for (let z = 0; z < this._depth; z++) {
            this.setupRegions(z);            
        }
        this.connectAllRegions();
    }

    generateLevel() {
        //create an empty map
        let map = new Array(this._width);
        for (let w = 0; w < this._width; w++) {
            map[w] = new Array(this._height);
        }
        //set up cave generator
        const generator = new ROT.Map.Cellular(this._width, this._height);
        generator.randomize(0.5);
        let iterations = 3;
        //smoothen the map
        for (let i = 0; i < iterations - 1; i++) {
            generator.create();
        }
        //smoothen one last time and update map
        generator.create(function(x, y, v) {
            if (v === 1) {
                map[x][y] = Game.Tile.floorTile;
            } else {
                map[x][y] = Game.Tile.wallTile;
            };
        });
        return map;
    }

    canFillRegion(x, y, z) {
        //check if tile is in bounds
        if (x < 0 || y < 0 || z < 0 || x >= this._width || y >= this._height || z >= this._depth) {
            return false;
        }
        //make sure tile doesn't already have region
        if (this._regions[z][x][y] !== 0) {
            return false;
        }
        //make sure the tile is walkable
        return this._tiles[z][x][y].isWalkable;
    }

    fillRegion(region, x, y, z) {
        let tilesfilled = 1;
        let tiles = [{x, y}];
        let tile, neighbors;
        //update the region of the original tile
        this._regions[z][x][y] = region;
        //keep looping while there are still tiles to process
        while (tiles.length > 0) {
            tile = tiles.pop();
            //get neighbors of the tile
            neighbors = Game.getNeighborPositions(tile.x, tile.y);
            //iterate through each neighbor - check if we can fill - if so update region
            //and add it to the processing list
            while (neighbors.length > 0) {
                tile = neighbors.pop();
                if (this.canFillRegion(tile.x, tile.y, z)) {
                    this._regions[z][tile.x][tile.y] = region;
                    tiles.push(tile);
                    tilesfilled++;
                }
            }
        }
        return tilesfilled;
    }

    removeRegion(region, z) {
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                if (this._regions[z][x][y] === region) {
                    //clear region and set to wall tile
                    this._regions[z][x][y] = 0;
                    this._tiles[z][x][y] = Game.Tile.wallTile;
                }                
            }            
        }
    }

    setupRegions(z) {
        let region = 1;
        let tilesfilled;
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                if (this.canFillRegion(x,y,z)) {
                    //try to fill region
                    tilesfilled = this.fillRegion(region, x, y, z);
                    //if it was too small, remove it
                    if (tilesfilled <= 20) {
                        this.removeRegion(region, z);
                    } else {
                        region++;
                    }
                }                
            }            
        }
    }

    findRegionOverlaps(z, region, region2) {
        //fetches a list of points that overlap between
        //one region at a given depth level, and a region at a level beneath it
        let matches = [];
        // Iterate through all tiles, checking if they respect
        // the region constraints and are floor tiles. We check
        // that they are floor to make sure we don't try to
        // put two stairs on the same tile.
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                if (this._tiles[z][x][y] === Game.Tile.floorTile && 
                    this._tiles[z + 1][x][y] === Game.Tile.floorTile &&
                    this._regions[z][x][y] === region &&
                    this._regions[z + 1][x][y] === region2) {
                        matches.push({x, y});
                    }                
            }            
        }
        return Game.randomizeArray(matches);
    }

    connectRegions(z, region, region2) {
        //tries to connect two regions by calculating where they overlap
        //and adding stairs
        const overlap = this.findRegionOverlaps(z, region, region2);
        //make sure there was an overlap
        if (overlap === 0) {
            return false;
        }
        const stairs = overlap[0];
        this._tiles[z][stairs.x][stairs.y] = Game.Tile.stairsDownTile;
        this._tiles[z + 1][stairs.x][stairs.y] = Game.Tile.stairsUpTile;
        return true;
    }

    connectAllRegions() {
        //tries to connect all regions for each depth level
        //starting with the top-most level
        for (let z = 0; z < this._depth - 1; z++) {
            let connected = {}
            let key;
            for (let x = 0; x < this._width; x++) {
                for (let y = 0; y < this._height; y++) {
                    key = this._regions[z][x][y] + ',' +
                    this._regions[z + 1][x][y];
                    
                    if (this._tiles[z][x][y] === Game.Tile.floorTile && 
                        this._tiles[z + 1][x][y] === Game.Tile.floorTile &&
                        !connected[key]) {
                            this.connectRegions(z, this._regions[z][x][y], this._regions[z+1][x][y]);
                            connected[key] = true;
                    }
                }                
            }
        }
    }

    get tiles() {
        return this._tiles;
    }
    get depth() {
        return this._depth;
    }
    get height() {
        return this._height;
    }
    get width() {
        return this._width;
    }
}