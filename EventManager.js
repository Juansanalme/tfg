const p2 = require('p2');
const World = require('./WorldManager');

var triggerID = 0;
var Trigger = function(x, z){
    var self = {
        id: 0,
        position: {'x':x, 'z':z},
        radius: 0,
        isBullet: false
    }

    self.isTouching = function(entity){
        if(World.distanceBetweenTwoPoints(self.position, entity.position) <= 
            self.radius + entity.radius){
            return true;
        }
        return false;
    };
    self.onTouch = function(entity){};

    return self;
}

Trigger.update = function(entities, blocks){
    //Check all triggers
    for(let t in Trigger.list){
        //Triggers to entities
        let trigger = Trigger.list[t];
        for(let e in entities){
            let entity = entities[e];
            if(trigger.isTouching(entity)){
                trigger.onTouch(entity);
            }
        };
        //Bullet to blocks
        if(trigger.isBullet){
            blocks.forEach(block => {
                if(trigger.isTouchingBlock(block)){
                    trigger.onTouchBlock();
                }           
            });
        }
    };
}

Trigger.list = {};

class Bullet {
    constructor(angle, x, z, enemy) {
        var self = Trigger(x, z);

        //CLASS PROPERTIES
        self.id = triggerID++;
        self.toRemove = false;
        self.lookingAt = angle;
        self.initialPosition = {'x':x, 'z':z};
        self.traveledDistance = 0;
        self.isEnemy = enemy;
        self.isBullet = true;
        //Bullet skills
        self.waveBeam = false;
        self.plasmaBeam = false;

        //Add sensor shape
        self.sensorShape = new p2.Circle();
        self.sensorShape.sensor = true;
        self.sensorBody = new p2.Body({position:[x, z]});
        self.sensorBody.addShape(self.sensorShape);
        World.addBody(self.sensorBody);

        self.sensorBody.velocity[0] = Math.cos(angle / 180 * Math.PI) * 15;
        self.sensorBody.velocity[1] = Math.sin(angle / 180 * Math.PI) * 15;

        //CLASS METHODS
        self.onTouch = function(entity){
            if (entity.isPlayer){
                if (self.isEnemy){//damage to player
                    entity.recieveDamage(50);
                    self.toRemove = !self.plasmaBeam;
                }
            }else{
                if (!self.isEnemy){//damage to enemy
                    //entity.recieveDamage(100);
                    self.toRemove = !self.plasmaBeam;
                }
            }
        }

        self.isTouchingBlock = function(block){
            let x = self.position.x;
            let z = self.position.z;
            let blockz1 = block.pZ + block.d/2;
            let blockz2 = block.pZ - block.d/2
            let blockx1 = block.pX + block.d/2;
            let blockx2 = block.pX - block.d/2
            if(x >= blockx2 && x <= blockx1 && z >= blockz2 && z <= blockz1){
                return true;
            }
            return false;
        }

        self.onTouchBlock = function(){
            self.toRemove = !self.waveBeam;
        }

        self.update = function () {
            if (self.traveledDistance > 17.5)
                self.toRemove = true;
            self.updatePosition();
        };
        self.updatePosition = function(){
            self.position.x = self.sensorBody.position[0];
            self.position.z = self.sensorBody.position[1];
            self.traveledDistance = World.distanceBetweenTwoPoints(self.initialPosition, self.position);
        }

        self.getInitPack = function(){
            return{
                id: self.id,
                position: {'x':self.position.x, 'z':self.position.z},
                lookingAt: self.lookingAt,
            }
        }
        self.getUpdatePack = function(){
            return{
                id: self.id,
                position: {'x':self.position.x, 'z':self.position.z},
                lookingAt: self.lookingAt,
            }
        }

        Bullet.list[self.id] = self;
        Bullet.initPack.push(self.getInitPack());
        Trigger.list[self.id] = self;
        return self;
    }

    //STATIC METHODS
    static getAllBullets() {
        let bullets = [];
        for (let i in Bullet.list)
            bullets.push(Bullet.list[i].getInitPack());
        return bullets;
    }

    static getUpdate() {
        let pack = [];
        for (let i in Bullet.list) {
            let bullet = Bullet.list[i];
            bullet.update();
            if (bullet.toRemove) {
                Bullet.removeFromGame(bullet);
            }
            else {
                pack.push(bullet.getUpdatePack());
            }
        }
        return pack;
    }

    static removeFromGame(bullet){
        bullet.sensorBody.removeShape(bullet.sensorShape);
        World.removeBody(bullet.sensorBody);
        delete Trigger.list[bullet.id];
        delete Bullet.list[bullet.id];
        Bullet.removePack.push(bullet.id);
    }

    static getFrameUpdateData() {
        let packs = {
            init:   Bullet.initPack,
            remove: Bullet.removePack,           
            update: Bullet.getUpdate(),
        }
        Bullet.emptyPacks();
        return packs;
    }

    static emptyPacks() {
        Bullet.initPack = [];
        Bullet.removePack = [];
    }
}

//STATIC VARIABLES
Bullet.list = {};
Bullet.initPack = [];
Bullet.removePack = [];

//EXPORTS
const _Event = {Trigger:Trigger, Bullet:Bullet}
module.exports = _Event;