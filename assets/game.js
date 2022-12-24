const Game = {
  _display: null,
  _currentScreen: null,
  _screenWidth: 80,
  _screenHeight: 24,
  init: function() {
    this._display = new ROT.Display({width: this._screenWidth, height: this._screenHeight});
    this._display.setOptions({
      fontSize: 24,
    })
    //create a helper function for binding to an event
    //and making it send it to the screen
    let game = this; // so that we dont lose this
    const bindEventToScreen = function (event) {
      window.addEventListener(event, (e) => {
        //when an event is received send it to the screen
        //if there is one
        if (game._currentScreen !== null) {
          //send the event type and data to the screen
          game._currentScreen.handleInput(event, e);
          //clear the screen
          game._display.clear();
          //render the screen
          game._currentScreen.render(game._display)
        }
      });
    }
    //bind keyboard input events
    bindEventToScreen('keydown');
    // bindEventToScreen('keyup');
    // bindEventToScreen('keypress');
  },
  getDisplay: function() {
    return this._display
  },
  getScreenWidth: function () {
    return this._screenWidth
  },
  getScreenHeight: function () {
    return this._screenHeight
  },
  switchScreen: function(screen) {
    console.log('HITTING SWITCH SCREEN');
    //if we had a screen before -- notify it that we exited
    if (this._currentScreen !== null) {
      this._currentScreen.exit();
    }
    //clear the display
    this.getDisplay().clear();
    this._currentScreen = screen;
    if (!this._currentScreen !== null) {
      this._currentScreen.enter();
      this._currentScreen.render(this._display);
    }
  }
}

// window.onload = function() {
//   Game.init();
//   document.body.appendChild(Game.getDisplay().getContainer());
// }

window.onload = () => {
  //initialize the game
  Game.init();
  //add the container to our HTML page
  document.body.appendChild(Game.getDisplay().getContainer());
  //load the start screen
  Game.switchScreen(Game.Screen.startScreen);

}

