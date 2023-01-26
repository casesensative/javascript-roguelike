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
    _player: null,
    move: function(dx, dy, dz) {
        const newX = this._player.x + dx;
        const newY = this._player.y + dy;
        const newZ = this._player.z + dz;
        //try to move the player to the new cell
        this._player.tryMove(newX, newY, newZ, this._map);
        // this._centerX = Math.max(0, Math.min(this._map.width - 1, this._centerX + dx));
        // console.log ('DY::: ', dy, 'map height :::', this._map.height - 1, 'centerY ::: ', this._centerY);
        // this._centerY = Math.max(0, Math.min(this._map.height - 1, this._centerY + dy));
        // console.log('RESULTS:::', Math.max(0, Math.min(this._map.height - 1, this._centerY + dy)))
    },
    enter: function() {
        const width = 100;
        const height = 48;
        const depth = 6;
        const tiles = new Game.Builder(width, height, depth).tiles;
        // let map = [];
        // const mapWidth = 500;
        // const mapHeight = 500;
        // for (let x = 0; x < mapWidth; x++) {
        //     //create the nested array for the y-values
        //     map.push([]);
        //     for (let y = 0; y < mapHeight; y++) {
        //         map[x].push(Game.Tile.nullTile);
        //     }            
        // }


        // Setup the map generator
        // console.log('MAP -- ', map);
        // const generator = new ROT.Map.Cellular(mapWidth, mapHeight);
        // generator.randomize(0.5);
        // const totalIterations = 3;
        //iteratively smoothen the map
        // for (let i = 0; i < totalIterations - 1; i++) {
        //     generator.create();
        // }
        //smoothen it one last time and then update our map
        // generator.create(function(x,y,v) {
        //     if (v === 1) {
        //         map[x][y] = Game.Tile.floorTile;
        //     } else {
        //         map[x][y] = Game.Tile.wallTile;
        //     }
        // });
        //create our player and set position
        this._player = new Game.Entity(Game.PlayerTemplate);
        //create our map from the tiles
        this._map = new Game.Map(tiles, this._player);
        //start the maps engine
        this._map.engine.start();

        //rexpaint map testing


    },
    exit: function() {
        console.log('Exited the play screen.');
    },
    render: function(display) {
        // display.drawText(3, 5, "%c{red}%b{white}This game is so much fun!");
        // display.drawText(4, 6, 'Press [Enter] to win, or [Esc] to lose.');
        const screenWidth = Game.screenWidth;
        const screenHeight = Game.screenHeight;
        //Make sure the X AXIS doesn't go to the left of the left bound
        let topLeftX = Math.max(0, this._player.x - (screenWidth / 2));
        //Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._map.width - screenWidth);
        //Make sure the Y AXIS doesn't move above the top bound
        let topLeftY = Math.max(0, this._player.y - (screenHeight / 2));
        //Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._map.height - screenHeight);
        //
        for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
                //fetch the glyph for the tile and render it to screen
                const tile = this._map.getTile(x, y, this._player.z);
                display.draw(x - topLeftX, y - topLeftY, tile.char, tile.foreground, tile.background);
            }
        }
        
        const entities = this._map.entities;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            //render entity if they are in screen bounds
            if (entity.x >= topLeftX && entity.y >= topLeftY &&
                entity.x < topLeftX + screenWidth && entity.y < topLeftY + screenHeight &&
                entity.z === this._player.z) {
                    display.draw(
                        entity.x - topLeftX,
                        entity.y - topLeftY,
                        entity.char,
                        entity.foreground,
                        entity.background
                    )
                }
            
        }
        //render players messages
        let messages = this._player.messages;
        console.log('MESSAGES', messages);
        for (let i = 0; i < messages.length; i++) {
            console.log(`Message ${i}`, messages[i]);
            display.drawText(0, i, '%c{white}%b{black}' + messages[i]);
        };
        //render player hp
        let stats = '%c{white}%b{black}';
        stats += vsprintf('HP: %d/%d', [this._player.hp, this._player.maxhp]);
        display.drawText(0, screenHeight, stats);


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
                    this.move(-1,0,0);
                    this._map.engine.unlock();
                    break;
                case ROT.KEYS.VK_D:
                    this.move(1,0,0);
                    this._map.engine.unlock();
                    break;
                case ROT.KEYS.VK_W:
                    this.move(0,-1,0);
                    this._map.engine.unlock();
                    break;
                case ROT.KEYS.VK_S:
                    this.move(0,1,0);
                    this._map.engine.unlock();
                    break;
            }

        } else if (inputType === 'keypress') {
            switch(String.fromCharCode(inputData.charCode)) {
                case '<' :
                    this.move(0,0,-1);
                    this._map.engine.unlock();
                    break;
                case '>' :
                    this.move(0,0,1);
                    this._map.engine.unlock();
                    break;
                default:
                    this._map.engine.unlock();
                    return false;
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