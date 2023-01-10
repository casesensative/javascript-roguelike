Game.AddOns = {};
Game.sendMessage = function(recipient, msg, args) {
    //check to see if recipient can receive messages
    if (recipient.hasAddOn(Game.AddOns.messageRecipient)) {
        //if args are present -- format msg
        if (args) {
            msg = vsprintf(msg, args);
        }
        recipient.receiveMessage(msg);
    }
}
Game.sendMessageNearby = function(map, cx, cy, msg, args) {
   //format msg if needed
    if (args) {
    msg = vsprintf(msg, args);
   };
   //get nearby entities
    const entities = map.getEntitiesInRadius(cx, cy, 5);
   //iterate through ents - send msg if they can receive
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].hasAddOn(Game.AddOns.messageRecipient)) {
            entities[i].receiveMessage(msg);
        }
    }
}

Game.AddOns.moveable = {
    name: 'moveable',
    tryMove: function(x, y, map) {
        //get the tile we want to check
        const tile = map.getTile(x, y);
        //check if tile is occupied by an entity
        const target = map.getEntityLocation(x, y);
        if (target) {
            //attack if occupied by entity and can be attacked
            if (this.hasAddOn('attacker') && target.hasAddOn('canDestroy')) {
                this.attack(target);
                return true;
            } else {
                return false;
            }
        } else if (tile.isWalkable) {
        // check if we can walk onto tile, and if so
        //move our x and y to the tile
            this._x = x;
            this._y = y;
            return true;
        } else if (tile.isDiggable) {
        //if tile isnt walkable but is diggable, dig it
            map.dig(x, y);
            return true;
        };
        return false;
    }
}
Game.AddOns.canDestroy = {
    name: 'canDestroy',
    init: function(template) {
        this._maxhp = template['maxhp'] || 10;
        this._hp = template['hp'] || this._maxhp;
        this._def = template['def'] || 0;
        Object.defineProperty(this, 'def', {
            get: function() {
                return this._def || 0; //why add 0? it should be declared
            }
        });
        Object.defineProperty(this, 'maxhp', {
            get: function() {
                return this._maxhp;
            }
        });
        Object.defineProperty(this, 'hp', {
            get: function() {
                return this._hp;
            }
        });
    },
    takeDamage: function(attacker, dam) {
        this._hp -= dam;
        if (this._hp <= 0) {
            Game.sendMessage(attacker, '%s has been slain.', [this.name] );
            Game.sendMessage(this, 'You have been slain.');
            this.map.removeEntity(this);
        }
    }
}
Game.AddOns.attacker = {
    name: 'attacker',
    groupName: 'attacker',
    init: function(template) {
        this._atk = template['atk'] || 1;
        Object.defineProperty(this, 'atk', {
            get: function() {
                return this._atk;
            }
        })
    },
    // get atk() {
    //     return this._atk;
    // },
    attack: function(target) {
        if (target.hasAddOn('canDestroy')) {
            // target.takeDamage(this, 1);
            const atk = this.atk;
            const def = target.def;
            const max = Math.max(0, atk-def);
            const dam = 1 + Math.floor(Math.random() * max);
            Game.sendMessage(this, 'You strike the %s for %d damage!', [target.name, dam]);
            Game.sendMessage(target, 'The %s strikes you for %d damage!', [this.name, dam]);
            target.takeDamage(this, dam);
        }
    }
}

Game.AddOns.messageRecipient = {
    name: 'messageRecipient',
    init: function(template) {
        this._messages = [];
        Object.defineProperty(this, 'messages', {
            get: function() {
                return this._messages;
            }
        });
    },
    // get messages() {
    //     return this._messages;
    // },
    receiveMessage: function(msg) {
        this._messages.push(msg);
    },
    clearMessages: function() {
        this._messages = [];
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
        //clear message queue
        this.clearMessages();
    }
}

Game.AddOns.fungusActor = {
    name: 'fungusActor',
    groupName: 'actor',
    init: function() {
        this._growthsRemaining = 5;
    },
    act: function() {
        if (this._growthsRemaining > 0) {
            if (Math.random() < 0.3) {
                const xoffset = Math.floor(Math.random() * 3) - 1; 
                const yoffset = Math.floor(Math.random() * 3) - 1; 
                if (xoffset !== 0 || yoffset || 0) {
                    if (this.map.isEmptyTile(this.x + xoffset, this.y + yoffset)) {   
                        const fungus = new Game.Entity(Game.FungusTemplate);
                        fungus.x = this.x + xoffset;
                        fungus.y = this.y + yoffset;
                        this.map.addEntity(fungus);
                        this._growthsRemaining -= 1;
                        Game.sendMessageNearby(this.map, fungus.x, fungus.y, 'The fungus is spreading!');
                    }
                }
            }
        }
    }
}

Game.PlayerTemplate = {
    char: '@',
    foreground: 'white',
    background: 'black',
    maxhp: 40,
    atk: 10,
    addOns: [Game.AddOns.moveable, Game.AddOns.playerActor,
             Game.AddOns.canDestroy, Game.AddOns.attacker,
             Game.AddOns.messageRecipient]
}

Game.FungusTemplate = {
    name: 'Fungus',
    char: 'F',
    foreground: 'green',
    maxhp: 10,
    addOns: [Game.AddOns.fungusActor, Game.AddOns.canDestroy]
}