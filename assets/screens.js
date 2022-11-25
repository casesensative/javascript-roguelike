Game.Screen = {};

//define our initial start screen
Game.Screen.startScreen = {
    enter: function() {
        console.log('Entered the start screen.');
    },
    exit: function() {
        console.log('Exited the start screen');
    },
    render: function(display) {
        display.drawText(1,1, "Javascript %b{blue}%c{red}Roguelike");
        display.drawText(1,2, "Press [Enter] to start!");
    },
    handleInput: function(inputType, inputData) {
        //when enter is pressed -- go to the play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.KEYS.VK_RETURN) {
                Game.switchScreen(Game.Screen.playScreen);
            }
        }
    }
}

Game.Screen.playScreen = {
    _map: null,
    enter: function() {
        console.log('entered the play screen.');
        let map = [];
        for (let x = 0; x < 80; x++) {
            //create the nested array for the y-values
            map.push([]);
            for (let y = 0; y < 24; y++) {
                map[x].push(Game.Tile.nullTile);
            }            
        }
        // Setup the map generator
        console.log('MAP -- ', map);
        const generator = new ROT.Map.Cellular(80, 24);
        generator.randomize(0.5);
        const totalIterations = 3;
        //iteratively smoothen the map
        for (let i = 0; i < totalIterations; i++) {
            generator.create();
        }
        //smoothen it one last time and then update our map
        generator.create(function(x,y,v) {
            if (v === 1) {
                map[x][y] = Game.Tile.floorTile;
            } else {
                map[x][y] = Game.Tile.wallTile;
            }
        });
        //create our map from the tiles
        console.log('CREATED MAP::: ', JSON.stringify(map));
        this._map = new Game.Map(map);
    },
    exit: function() {
        console.log('Exited the play screen.');
    },
    render: function(display) {
        // display.drawText(3, 5, "%c{red}%b{white}This game is so much fun!");
        // display.drawText(4, 6, 'Press [Enter] to win, or [Esc] to lose.');
        for (let x = 0; x < this._map.width; x++) {
            for (let y = 0; y < this._map.height; y++) {
                //fetch the glyph for the tile and render it to screen
                console.log('GET TILE::', this._map.getTile(x, y), 'X', x, 'Y', y);
                const glyph = this._map.getTile(x, y).glyph;
                console.log('GLYPH:::', glyph);
                // console.log('drawing stuff');
                // console.log('DRAWING', 'X::', x, 'Y::', y, 'CHAR::', Game.Glyph.char, 'FOREGROUND::', Game.Glyph.foreground, 'BACKGROUND::', Game.Glyph.background);
                display.draw(x, y, glyph.char, glyph.foreground, glyph.background);
            }
        }
    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            //if enter is pressed, go to the win screen
            //if esc is pressed, go to lose screen
            if (inputData.keyCode === ROT.KEYS.VK_RETURN) {
                Game.switchScreen(Game.Screen.winScreen);
            } else if (inputData.keyCode === ROT.KEYS.VK_ESCAPE) {
                Game.switchScreen(Game.Screen.loseScreen);
            }
        }
    }
}

//Define winning screen
Game.Screen.winScreen = {
    enter: function() {
        console.log('Entered win screen.');
    },
    exit: function() {
        console.log('Exited the win screen.');
    },
    render: function(display) {
        //render our prompt to the screen.
        for (let i = 0; i < 22; i++) {
            const r = Math.round(Math.random() * 255);
            const g = Math.round(Math.random() * 255);
            const b = Math.round(Math.random() * 255);
            const background = ROT.Color.toRGB([r,g,b]);
            display.drawText(2, i + 1, '%b{' + background + '}You win!');
        }
    },
    handleInput: function(inputType, inputData) {
        //nothing to do here
    }
}

Game.Screen.loseScreen = {
    enter: function() {
        console.log('Entered the lose screen.');
    },
    exit: function() {
        console.log('Exited the lose screen.');
    },
    render: function(display) {
        //render our prompt to the screen.
        for (let i = 0; i < 22; i++) {
            display.drawText(2, i + 1, '%b{red}You lose! :(');
        }
    },
    handleInput: function(inputType, inputData) {
        //nothing to do here.
    }
}