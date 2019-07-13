const p2 = require('p2');
const Trigger = require ('./EventManager');

class WeaponDrop {
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

        //CLASS METHODS
        self.onTouch = function(entity){
            if (entity.isPlayer){
                entity.changeWeapon(dropType);
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
                sprite: dropType.dropName,
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

            delete WeaponDrop.list[self.id];
            delete Trigger.list[self.id];
            delete this;
        }

        //add it to the game
        world.addBody(self.sensorBody);
        WeaponDrop.list[self.id] = self;
        Trigger.list[self.id] = self;
        Trigger.initPack.push(self.getInitPack());
        return self;
    }
}

//STATIC VARIABLES
WeaponDrop.list = {};

module.exports = WeaponDrop;