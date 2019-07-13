const p2 = require('p2');
const Trigger = require ('./EventManager');

class PotionDrop {
    constructor(x, z, dropType, world) {
        var self = Trigger(x, z, world);

        //CLASS PROPERTIES
        self.toRemove = false;
        self.lookingAt = 90;
        self.initialPosition = {'x':x, 'z':z};

        //Add sensor shape
        self.sensorShape = new p2.Circle();
        self.sensorShape.sensor = true;
        self.sensorBody = new p2.Body({position:[x, z]});
        self.sensorBody.addShape(self.sensorShape);

        switch(dropType){
            case 1: self.name = 'healitem'; break;
            case 2: self.name = 'manaitem'; break;
            case 3: self.name = 'healpotion'; break;
            case 4: self.name = 'manapotion'; break;
        }

        //CLASS METHODS
        self.onTouch = function(entity){
            if (entity.isPlayer){
                let inventoryFull;
                switch(dropType){
                    case 1: inventoryFull = entity.recoverHP(); break;
                    case 2: inventoryFull = entity.recoverMana(); break;
                    case 3: inventoryFull = entity.getItemHP(); break;
                    case 4: inventoryFull = entity.getItemMana(); break;
                }
                if (inventoryFull)
                    self.toRemove = true;
            }
        }

        self.update = function () {
            setInterval(() => {
                self.toRemove = true;
            }, 15 * 1000);
        };

        self.getInitPack = function(){
            return{
                id: self.id,
                position: {'x':self.position.x, 'z':self.position.z},
                lookingAt: self.lookingAt,
                sprite: self.name,
            }
        }
        self.getUpdatePack = function(){
            return{
                id: self.id,
                position: {'x':self.position.x, 'z':self.position.z},
                lookingAt: self.lookingAt,
            }
        }

        self.removeFromGame = function(){
            self.sensorBody.removeShape(self.sensorShape);
            world.removeBody(self.sensorBody);
            Trigger.removePack.push(self.id);

            delete PotionDrop.list[self.id];
            delete Trigger.list[self.id];
            delete this;
        }

        //add it to the game
        world.addBody(self.sensorBody);
        PotionDrop.list[self.id] = self;
        Trigger.list[self.id] = self;
        Trigger.initPack.push(self.getInitPack());
        return self;
    }
}

//STATIC VARIABLES
PotionDrop.list = {};

module.exports = PotionDrop;