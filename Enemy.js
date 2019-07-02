const p2 = require('p2');
const Entity = require ('./EntityManager');
const Bullet = require ('./Trigger_Bullet');
const StateMachine = require ('./StateMachine');

class Enemy {
    constructor(id, x, z, type, weapon, world) {
        var self = Entity(id, x, z);

        //CLASS PROPERTIES
        self.initialPosition = {'x':x, 'z':z};
        self.stateMachine = StateMachine();
        self.attackDamage = 25;
        self.shootingCD = true;
        self.cooldownInterval;

        //Type properties
        self.weapon = weapon;
        var
        _PlayerDetectDistance = type.playerDetectDistance,
        _RoamMaxDistance = type.roamMaxDistance,
        _FollowMaxDistance = type.followMaxDistance,
        _PlayerFollowDistance = type.playerFollowDistance,
        _SpawnDistance = type.spawnDistance,
        _roamSpeed = type.roamSpeed,
        _followSpeed = type.followSpeed,
        _returnSpeed = type.returnSpeed;

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
                self.stateMachine.setState(dead);
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
                model: type.model,
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

        var getClosestPlayer = function (){
            let bestDistance = 0;
            self.closestPlayerPosition = false;
            for(let i in Entity.list){             
                if (Entity.list[i].isPlayer){
                    let distance = world.distanceBetweenTwoPoints(self.position, Entity.list[i].position);
                    if (bestDistance == 0 || distance > bestDistance){
                        bestDistance = distance;
                        self.closestPlayerPosition = Entity.list[i].position;
                    }
                }
            }
        }
        
        self.closestPlayerPosition;
        self.lookForPlayersInterval;
        self.randomMovementInterval;
        self.randomDirection = 0;

        var setAngleMov = function(angle, speed){
            self.circleBody.velocity[0] = Math.cos(angle / 180 * Math.PI) * speed;
            self.circleBody.velocity[1] = Math.sin(angle / 180 * Math.PI) * speed;
            self.lookingAt = angle - 180;
        }

        var sleep = function(){
            let distanceFromSpawn = world.distanceBetweenTwoPoints(self.initialPosition, self.position);
            if(distanceFromSpawn > _RoamMaxDistance){
                self.stateMachine.setState(returnToSpawn);
            }

            if (self.closestPlayerPosition){
                let distanceFromClosestPlayer = world.distanceBetweenTwoPoints(self.position, self.closestPlayerPosition);
                if(distanceFromClosestPlayer < _PlayerDetectDistance){
                    self.stateMachine.setState(followPlayer);
                }
            }
        }
        sleep.onEnter = function(){
            clearInterval(self.lookForPlayersInterval);
            clearInterval(self.randomMovementInterval);

            self.randomMovementInterval = setInterval(() => {
                self.randomDirection = Math.random() * 359;
                setAngleMov(self.randomDirection, _roamSpeed);
            }, 1000);
                
            self.lookForPlayersInterval = setInterval(() => {
                getClosestPlayer();
            }, 1000 * 1/3);
        }

        var followPlayer = function(){

            let distanceFromSpawn = world.distanceBetweenTwoPoints(self.initialPosition, self.position);
            if(distanceFromSpawn > _FollowMaxDistance){
                self.stateMachine.setState(returnToSpawn);
            }else if(self.closestPlayerPosition){
                let distanceToPlayer = world.distanceBetweenTwoPoints(self.position, self.closestPlayerPosition);
                if(distanceToPlayer < _PlayerDetectDistance + _PlayerFollowDistance){
                    let angle = world.angleBetweenTwoPoints(self.position, self.closestPlayerPosition);
                    setAngleMov(angle, -_followSpeed);
                }else{
                    self.stateMachine.setState(returnToSpawn);
                }
            }else{
                self.stateMachine.setState(returnToSpawn);
            }

            self.shootingCheck();
        }       
        followPlayer.onEnter = function(){
            //clearInterval(self.lookForPlayersInterval);
            clearInterval(self.randomMovementInterval);
        }

        var returnToSpawn = function(){     
            let distanceFromSpawn = world.distanceBetweenTwoPoints(self.initialPosition, self.position);
            if(distanceFromSpawn < _SpawnDistance){                    
                setAngleMov(0, 0);
                self.stateMachine.setState(sleep);
            }
            /*
            if (self.closestPlayerPosition){
                let distanceFromSpawn = world.distanceBetweenTwoPoints(self.initialPosition, self.position);
                let distanceToPlayer = world.distanceBetweenTwoPoints(self.position, self.closestPlayerPosition);
                if (distanceToPlayer < 5 && distanceFromSpawn + 5 < _FollowMaxDistance){
                    self.stateMachine.setState(followPlayer);
                }
            }*/
        }
        returnToSpawn.onEnter = function(){
            //clearInterval(self.lookForPlayersInterval);
            clearInterval(self.randomMovementInterval);

            self.randomMovementInterval = setInterval(() => {
                let angle = world.angleBetweenTwoPoints(self.position, self.initialPosition);
                setAngleMov(angle, -_returnSpeed);           
            }, 2000);
            let angle = world.angleBetweenTwoPoints(self.position, self.initialPosition);
            setAngleMov(angle, -_returnSpeed);
        }

        var dead = function(){
        }
        dead.onEnter = function(){
            clearInterval(self.lookForPlayersInterval);  
            clearInterval(self.randomMovementInterval);
            setAngleMov(0, 0);      
        }

        //Add it to the game
        world.addBody(self.circleBody);
        Enemy.list[self.id] = self;
        Entity.list[self.id] = self;
        Entity.initPack.push(self.getInitPack());

        //Set initial state
        self.stateMachine.setState(sleep);

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