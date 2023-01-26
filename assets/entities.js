Game.AddOns = {};
Game.sendMessage = function(recipient, msg, args) {
    //check to see if recipient can receive messages
    if (recipient.hasAddOn(Game.AddOns.messageRecipient)) {
        console.log('can receive');
        //if args are present -- format msg
        if (args) {
            msg = vsprintf(msg, args);
        }
        recipient.receiveMessage(msg);
    }
}
Game.sendMessageNearby = function(map, cx, cy, cz, msg, args) {
   //format msg if needed
    if (args) {
    msg = vsprintf(msg, args);
   };
   //get nearby entities
    const entities = map.getEntitiesInRadius(cx, cy, cz, 5);
   //iterate through ents - send msg if they can receive
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].hasAddOn(Game.AddOns.messageRecipient)) {
            entities[i].receiveMessage(msg);
        }
    }
}

Game.AddOns.moveable = {
    name: 'moveable',
    tryMove: function(x, y, z, map) {
        map = this.map;
        //get the tile we want to check
        const tile = map.getTile(x, y, this.z);
        //check if tile is occupied by an entity
        const target = map.getEntityLocation(x, y, this.z);
        
        console.log('Z::', z, 'THIS.Z::', this.z);

        if (z < this.z) {
            if (tile !== Game.Tile.stairsUpTile) {
                Game.sendMessage(this, "You can't go up here!");
            } else {
                Game.sendMessage(this, "You ascend to level %d", [z + 1]);
                this.setPosition(x, y, z);
            }
        } else if (z > this.z) {
            if (tile !== Game.Tile.stairsDownTile) {
                Game.sendMessage(this, "You can't go down here!");
            } else {
                this.setPosition(x, y, z);
                Game.sendMessage(this, "You descend to level %d!", [z + 1])
            }
        } else if (target) {
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
        // console.log('walkable');
            this.setPosition(x, y, z);
            return true;
        } else if (tile.isDiggable) {
        //if tile isnt walkable but is diggable, dig it
            map.dig(x, y, z);
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
            console.log('before adding attack msg');
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
        console.log('locking the engine and waiting for player input');
        this.map.engine.lock();
        //clear message queue
        console.log('clearing message queue');
        this.clearMessages();
    }
}

Game.AddOns.fungusActor = {
    name: 'fungusActor',
    groupName: 'actor',
    init: function() {
        this._growthsRemaining = 1;
    },
    act: function() {
        if (this._growthsRemaining > 0) {
            if (Math.random() < 0.3) {
                const xoffset = Math.floor(Math.random() * 3) - 1; 
                const yoffset = Math.floor(Math.random() * 3) - 1; 
                if (xoffset !== 0 || yoffset || 0) {
                    if (this.map.isEmptyTile(this.x + xoffset, this.y + yoffset, this.z)) {   
                        const fungus = new Game.Entity(Game.FungusTemplate);
                        fungus.setPosition(this.x + xoffset, this.y + yoffset, this.z);
                        this.map.addEntity(fungus);
                        this._growthsRemaining -= 1;
                        Game.sendMessageNearby(this.map, fungus.x, fungus.y, fungus.z, 'The fungus is spreading!');
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