Game.Entity = class extends Game.Glyph {
    constructor(template = {}) {
        super(template);
        this._name = template['name'] || '';
        this._x = template['x'] || 0;
        this._y = template['y'] || 0;
        this._map = null;
        //object for tracking addOns to entities
        this._addOns = {};
        this._addOnsGroups = {};
        //set up addOns array to iterate
        let addOns = template['addOns'] || [];
        //iterate through each addOn
        for (let i = 0; i < addOns.length; i++) {
            //for each addOn, add its keys to this entity
            for (const key in addOns[i]) {
                if (key !== 'init' && key !== 'name' && !this.hasOwnProperty(key)) {
                    this[key] = addOns[i][key];                    
                } 
            }
            //add the current addOns name for tracking all addons
            //attached to this entity
            this._addOns[addOns[i].name] = true;
            //if there is a groupname add it
            if (addOns[i].groupName) {
                this._addOnsGroups[addOns[i].groupName] = true;
            }
            //call the init function for the addon if it exists
            if (addOns[i].init) {
                addOns[i].init.call(this, template);    
            }
        }
    }

    

    //methods
    hasAddOn(addOn = {}) {
        if (typeof addOn === 'object') {
            return this._addOns[addOn.name];
        } else {
            return this._addOns[addOn] || this._addOnsGroups[addOn];
        }
    };

    //getters and setters

    set name(name) {
        this._name = name;
    }
    set x(x) {
        this._x = x;
    }
    set y(y) {
        this._y = y;
    }
    set map(map) {
        this._map = map;
    }
    get map() {
        return this._map;
    } 
    get name() {
        return this._name;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
}