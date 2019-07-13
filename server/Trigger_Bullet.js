const p2 = require('p2');
const Trigger = require ('./EventManager');

class Bullet {
    constructor(angle, x, z, enemy, weapon, userAttack, world) {
        var self = Trigger(x, z, world);

        //CLASS PROPERTIES
        self.toRemove = false;
        self.lookingAt = angle;
        self.initialPosition = {'x':x, 'z':z};
        self.traveledDistance = 0;
        //self.attack = userAttack;
        self.isEnemy = enemy;
        self.isBullet = true;
        self.weapon = weapon;
        self.name = weapon.name;

        //Add sensor shape
        self.sensorShape = new p2.Circle();
        self.sensorShape.sensor = true;
        self.sensorBody = new p2.Body({position:[x, z]});
        self.sensorBody.addShape(self.sensorShape);

        self.sensorBody.velocity[0] = Math.cos(angle / 180 * Math.PI) * weapon.speed;
        self.sensorBody.velocity[1] = Math.sin(angle / 180 * Math.PI) * weapon.speed;

        //CLASS METHODS
        self.onTouch = function(entity){
            if (entity.isPlayer){
                if (self.isEnemy){//damage to player
                    entity.recieveDamage(weapon.damage);
                    self.toRemove = true;
                }
            }else{
                if (!self.isEnemy){//damage to enemy
                    entity.recieveDamage(weapon.damage);
                    self.toRemove = true;
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
            self.toRemove = true;
        }

        self.update = function () {
            if (self.traveledDistance > self.weapon.range)
                self.toRemove = true;
            self.updatePosition();
        }
        self.updatePosition = function(){
            self.position.x = self.sensorBody.position[0];
            self.position.z = self.sensorBody.position[1];
            self.traveledDistance = world.distanceBetweenTwoPoints(self.initialPosition, self.position);
        }

        self.getInitPack = function(){
            return{
                id: self.id,
                position: {'x':self.position.x, 'z':self.position.z},
                lookingAt: self.lookingAt,
                sprite: self.weapon.name,
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

            delete Trigger.list[self.id];
            delete Bullet.list[self.id];
            delete this;
        }

        //add it to the game
        world.addBody(self.sensorBody);
        Bullet.list[self.id] = self;
        Trigger.list[self.id] = self;
        Trigger.initPack.push(self.getInitPack());
        return self;
    }

    //STATIC METHODS
    static getAllBullets() {
        let bullets = [];
        for (let i in Bullet.list)
            bullets.push(Bullet.list[i].getInitPack());
        return bullets;
    }
}

//STATIC VARIABLES
Bullet.list = {};

module.exports = Bullet;