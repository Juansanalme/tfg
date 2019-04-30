const p2 = require('p2');
const Entity = require ('./EntityManager');
const Bullet = require ('./Trigger_Bullet');
const StateMachine = require ('./StateMachine');

class Enemy {
    constructor(id, x, z, weapon, world) {
        var self = Entity(id, x, z);

        //CLASS PROPERTIES
        self.initialPosition = {'x':x, 'z':z};
        self.stateMachine = StateMachine();
        self.targetPlayer;
        self.attackDamage = 25;
        self.weapon = weapon;
        self.shootingCD = true;
        self.cooldownInterval;

        //p2 BODY
        self.circleBody = new p2.Body({
            mass: 15,
            position: [x, z]
        });
        self.circleShape = new p2.Circle({radius:self.radius});
        self.circleBody.addShape(self.circleShape);

        //CLASS METHODS
        self.update = function(){
            self.updatePosition();
            self.stateMachine.update();
        };
        
        self.shootBullet = function(angle){
            new Bullet(angle, self.position.x, self.position.z, true, self.weapon, self.attackDamage, world);
        };

        self.shootingCheck = function(){
            if (self.shootingCD) {
                self.shootingCD = false;
                self.shootBullet(self.lookingAt);

                self.cooldownInterval = setInterval(() => {
                    self.shootingCD = true;
                    clearInterval(self.cooldownInterval);
                }, self.weapon.cooldown);
            }
        }

        self.calculateAngle = function(x, y){
            self.lookingAt = (Math.atan2(-x, -y) / Math.PI * 180 + 90).toFixed(2);
        };

        self.recieveDamage = function(damage){
            self.currentHP -= damage;
            if (self.currentHP <= 0){
                self.toRemove = true;
            }
        }

        self.dropLoot = function(){
            world.createLoot(self.position.x, self.position.z);
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

        self.removeFromGame = function(){
            self.dropLoot();

            self.circleBody.removeShape(self.circleShape);
            world.removeBody(self.circleBody);            
            Entity.removePack.push(self.id);
            
            delete Entity.list[self.id];
            delete Enemy.list[self.id];
            delete this;
        }

        //AI STATES
        var sleep = function(){
            //look for players
            //target player
            self.targetPlayer = true;
            if(self.targetPlayer){
                self.stateMachine.setState(followPlayer);
            }
        }
        var followPlayer = function(){
            let distanceFromSpawn = world.distanceBetweenTwoPoints(self.initialPosition, self.position);
            if(distanceFromSpawn > 15){
                self.targetPlayer = false;
                self.stateMachine.setState(returnToSpawn);
            }else if(self.targetPlayer){
                let angle = 0;
                self.circleBody.velocity[0] = Math.cos(angle / 180 * Math.PI) * 7.5;
                self.circleBody.velocity[1] = Math.sin(angle / 180 * Math.PI) * 7.5;
            }else{
                self.targetPlayer = false;
                self.stateMachine.setState(returnToSpawn);
            }
        }
        var returnToSpawn = function(){            
            let distanceFromSpawn = world.distanceBetweenTwoPoints(self.initialPosition, self.position);
            if(distanceFromSpawn < 1){
                self.stateMachine.setState(sleep);
            }
            let angle = 180;
            self.circleBody.velocity[0] = Math.cos(angle / 180 * Math.PI) * 7.5;
            self.circleBody.velocity[1] = Math.sin(angle / 180 * Math.PI) * 7.5;
        }

        //Set initial state
        self.stateMachine.setState(sleep);

        //Add it to the game
        world.addBody(self.circleBody);
        Enemy.list[self.id] = self;
        Entity.list[self.id] = self;
        Entity.initPack.push(self.getInitPack());
        return self;
    }

    //STATIC METHODS
    static getAllEnemies() {
        let enemies = [];
        for (let i in Enemy.list)
            enemies.push(Enemy.list[i].getInitPack());
        return enemies;
    }
}

Enemy.list = {};

//EXPORTS
module.exports = Enemy;