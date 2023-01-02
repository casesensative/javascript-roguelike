Game.AddOns = {};

Game.AddOns.moveable = {
    name: 'moveable',
    tryMove: function(x, y, map) {
        //get the tile we want to check
        const tile = map.getTile(x, y);
        //check if tile is occupied by an entity
        if (map.getEntityLocation(x, y)) {
            return false;
        }
        //check if we can walk onto tile, and if so
        //move our x and y to the tile
        if (tile.isWalkable) {
            this._x = x;
            this._y = y;
            return true;
        } else if (tile.isDiggable) {
            map.dig(x, y);
            return true;
        }
        return false;
    }
}

Game.AddOns.playerActor = {
    name: 'playerActor',
    groupName: 'actor',
    act: function() {
        //re-render the screen
        Game.refresh();
        //lock engine and wait for player to press a key
        this.map.engine.lock();
    }
}

Game.AddOns.fungusActor = {
    name: 'fungusActor',
    groupName: 'actor',
    act: function() {

    }
}

Game.PlayerTemplate = {
    char: '@',
    foreground: 'white',
    background: 'black',
    addOns: [Game.AddOns.moveable, Game.AddOns.playerActor]
}

Game.FungusTemplate = {
    char: 'F',
    foreground: 'green',
    addOns: [Game.AddOns.fungusActor]
}