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
        let map = [];
        for (let i = 0; i < 80; i++) {
            //create the nested array for the y-values
            map.push([]);
            for (let y = 0; y < 24; y++) {
                map[i].push(Game)
                
            }            
        }
        // console.log('Entered the play screen.');
    },
    exit: function() {
        console.log('Exited the play screen.');
    },
    render: function(display) {
        display.drawText(3, 5, "%c{red}%b{white}This game is so much fun!");
        display.drawText(4, 6, 'Press [Enter] to win, or [Esc] to lose.');
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