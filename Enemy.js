const p2 = require('p2');
const Entity = require ('./EntityManager');
const Event = require ('./EventManager');

class Enemy {
    constructor(id, x, z, world) {
        var self = Entity(id, x, z);
        self.isPlayer = false;
        self.toRemove = false;

        //CLASS PROPERTIES
        self.shootingCD = true;
        self.shootingTimeCD = 500;
        self.cooldownInterval;

        //p2 BODY
        self.circleBody = new p2.Body({
            mass: 15,
            position: [x, z]
        });
        self.circleShape = new p2.Circle({radius:self.radius});
        self.circleBody.addShape(self.circleShape); 
        world.addBody(self.circleBody);

        //CLASS METHODS
        self.update = function(){
            self.updatePosition();
            self.updateSpeed();
            self.calculateAngle();
            //self.shootingCheck();            
        };
        self.updatePosition = function(){
            self.position.x = self.circleBody.position[0];            
            self.position.z = self.circleBody.position[1];
        }
        
        self.shootBullet = function(angle){
            new Event.Bullet(angle, self.position.x, self.position.z, true, world);
        };

        self.shootingCheck = function(){
            if (self.shootingCD) {
                self.shootingCD = false;
                self.shootBullet(self.lookingAt);

                self.cooldownInterval = setInterval(() => {
                    self.shootingCD = true;
                    clearInterval(self.cooldownInterval);
                }, self.shootingTimeCD);
            }
        }

        self.calculateAngle = function(){
            let x = 0;
            let y = 0;
            self.lookingAt = (Math.atan2(-x, -y) / Math.PI * 180 + 90).toFixed(2);
        };

        self.recieveDamage = function(damage){
            self.currentHP -= damage;
            if (self.currentHP <= 0){
                self.toRemove = true;
            }
        }

        self.updateSpeed = function(){

        };

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

        self.removeFromGame = function(){
            self.circleBody.removeShape(self.circleShape);
            world.removeBody(self.circleBody);            
            Enemy.removePack.push(self.id);
            
            delete Entity.list[self.id];
            delete Enemy.list[self.id];
        }

        Enemy.list[self.id] = self;
        Enemy.initPack.push(self.getInitPack());
        return self;
    }

    //STATIC METHODS

    static getAllEnemies() {
        let enemies = [];
        for (let i in Enemy.list)
            enemies.push(Enemy.list[i].getInitPack());
        return enemies;
    }

    static getUpdate() {
        let pack = [];
        for (let i in Enemy.list) {
            let enemy = Enemy.list[i];
            enemy.update();
            if (enemy.toRemove) {
                enemy.removeFromGame();
            }
            else {
                pack.push(enemy.getUpdatePack());
            }
        }
        return pack;
    }

    static getFrameUpdateData() {
        let packs = {
            init:   Enemy.initPack,
            remove: Enemy.removePack,           
            update: Enemy.getUpdate(),
        }
        Enemy.emptyPacks();
        return packs;
    }

    static emptyPacks() {
        Enemy.initPack = [];
        Enemy.removePack = [];
    }
}
//STATIC VARIABLES
Enemy.list = {};
Enemy.initPack = [];
Enemy.removePack = [];

//EXPORTS
module.exports = Enemy;