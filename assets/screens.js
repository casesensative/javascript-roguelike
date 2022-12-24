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
    _centerX: 0,
    _centerY: 0,
    move: function(dx, dy) {
        this._centerX = Math.max(0, Math.min(this._map.width - 1, this._centerX + dx));
        console.log ('DY::: ', dy, 'map height :::', this._map.height - 1, 'centerY ::: ', this._centerY);
        this._centerY = Math.max(0, Math.min(this._map.height - 1, this._centerY + dy));
        console.log('RESULTS:::', Math.max(0, Math.min(this._map.height - 1, this._centerY + dy)))
    },
    enter: function() {
        console.log('entered the play screen.');
        let map = [];
        const mapWidth = 500;
        const mapHeight = 500;
        for (let x = 0; x < mapWidth; x++) {
            //create the nested array for the y-values
            map.push([]);
            for (let y = 0; y < mapHeight; y++) {
                map[x].push(Game.Tile.nullTile);
            }            
        }
        // Setup the map generator
        // console.log('MAP -- ', map);
        const generator = new ROT.Map.Cellular(mapWidth, mapHeight);
        generator.randomize(0.5);
        const totalIterations = 3;
        //iteratively smoothen the map
        for (let i = 0; i < totalIterations - 1; i++) {
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
                this._map = new Game.Map(map);
    },
    exit: function() {
        console.log('Exited the play screen.');
    },
    render: function(display) {
        // display.drawText(3, 5, "%c{red}%b{white}This game is so much fun!");
        // display.drawText(4, 6, 'Press [Enter] to win, or [Esc] to lose.');
        const screenWidth = Game.getScreenWidth();
        const screenHeight = Game.getScreenHeight();
        //Make sure the X AXIS doesn't go to the left of the left bound
        let topLeftX = Math.max(0, this._centerX - (screenWidth / 2));
        //Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._map.width - screenWidth);
        //Make sure the Y AXIS doesn't move above the top bound
        let topLeftY = Math.max(0, this._centerY - (screenHeight / 2));
        //Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._map.height - screenHeight);
        //
        for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
                //fetch the glyph for the tile and render it to screen
                // console.log('GET TILE::', this._map.getTile(x, y), 'X', x, 'Y', y);
                const glyph = this._map.getTile(x, y).glyph;
                // console.log('GLYPH:::', glyph);
                // console.log('drawing stuff');
                // console.log('DRAWING', 'X::', x, 'Y::', y, 'CHAR::', Game.Glyph.char, 'FOREGROUND::', Game.Glyph.foreground, 'BACKGROUND::', Game.Glyph.background);
                display.draw(x - topLeftX, y - topLeftY, glyph.char, glyph.foreground, glyph.background);
            }
        }
        display.draw(
            this._centerX - topLeftX,
            this._centerY - topLeftY,
            '@',
            'white',
            'black'
        );
    },
    handleInput: function(inputType, inputData) {
        if (inputType === 'keydown') {
            // INPUT
            switch (inputData.keyCode) {
                case ROT.KEYS.VK_RETURN:
                    Game.switchScreen(Game.Screen.winScreen);
                    break;
                case ROT.KEYS.VK_ESCAPE:
                    Game.switchScreen(Game.Screen.loseScreen);
                    break;
                    //movement
                case ROT.KEYS.VK_A:
                    this.move(-1,0);
                    console.log('PLAYER X ::: ', this._centerX, 'PLAYER Y ::: ', this._centerY);
                    break;
                case ROT.KEYS.VK_D:
                    this.move(1,0);
                    console.log('PLAYER X ::: ', this._centerX, 'PLAYER Y ::: ', this._centerY);
                    break;
                case ROT.KEYS.VK_W:
                    this.move(0,-1);
                    console.log('PLAYER X ::: ', this._centerX, 'PLAYER Y ::: ', this._centerY);
                    break;
                case ROT.KEYS.VK_S:
                    this.move(0,1);
                    console.log('PLAYER X ::: ', this._centerX, 'PLAYER Y ::: ', this._centerY);
                    break;
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