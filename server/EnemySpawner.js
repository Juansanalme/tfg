const Entity = require('./EntityManager');
const Enemy = require('./Enemy');

var spawnerId = 0;
var EnemySpawner = function(x, z, eType, weapon, world){
    var self = {

        id: spawnerId,
        enemyType: eType,
        weapon: weapon,
        score: eType.score + weapon.score,

        position: {'x':x, 'z':z},
        currentChildren: 0,
        maxChildren: 3,
        isAlive: false,
        hasLeader: false,

        checkMinTime: 5,
        checkMaxTime: 10,
        currentCheckTime: 0,

    }

    self.update = function(){
        if(!self.isAlive && self.currentCheckTime >= 10){
            this.isAlive = true;
            self.createChild();
        }
        if(self.currentChildren == self.maxChildren){
            self.currentCheckTime = 0;
        }
    }

    self.createChild = function(){
        self.currentCheckTime = 0;
        self.currentChildren++;
        let id = Entity.getID();
        new Enemy(id, self, world);
    }

    self.createLeader = function(){

    }

    self.childDeath = function(){
        self.currentChildren--;
        if (self.currentChildren == 0){
            self.isAlive = false;
            self.currentCheckTime = 0;
        }
    }

    self.removeFromGame = function(){
        delete EnemySpawner.list[self.id];
        delete this;
    }
    
    var dieRollTime = 1000;
    setInterval(function(){
        if(self.isAlive && self.currentChildren < self.maxChildren){
            if(self.currentCheckTime > self.checkMinTime && self.currentCheckTime < self.checkMaxTime) {

                let spawnChance = Math.floor(Math.random() * 10) + 1;
                if(spawnChance > 6) {
                    self.createChild();
                }

            }else if(self.currentCheckTime > self.checkMaxTime){
                self.createChild();
            }
        }
    }, dieRollTime);
    
    setInterval(function(){
        self.currentCheckTime++;
    }, 1000);

    EnemySpawner.list[spawnerId] = self;
    spawnerId++;
    return self;
}

EnemySpawner.update = function(){
    for (let i in EnemySpawner.list)
        EnemySpawner.list[i].update();
}

EnemySpawner.list = {};

//EXPORTS

module.exports = EnemySpawner;