const p2 = require('p2');
const Entity = require ('./EntityManager');
const Bullet = require ('./Trigger_Bullet');

const _WIDTH  = 1280,
      _HEIGHT = 720;

class Player {
    constructor(id, x, z, weapon, world) {
        var self = Entity(id, x, z);
        self.isPlayer = true;

        //CLASS PROPERTIES
        self.input = {d:false, a:false, w:false, s:false, mouse:false, e:false, r:false, special:false};
        self.mousePosition = {x:0, y:0};
        self.attackDamage = 25;
        self.movSpeed = 10;
        self.weapon = weapon;
        self.shootingCD = true;
        self.cooldownInterval;
        self.itemIntervalHP, self.itemIntervalMana;
        self.healPotionCD = self.manaPotionCD = true;
        self.specialInterval, self.specialCD = true;
        self.healPotions = 0;
        self.manaPotions = 0;
        self.score = 0;
        self.level = 1;
        self.isAlive = true;

        //p2 BODY
        self.circleBody = new p2.Body({
            mass: 5,
            position: [x, z]
        });
        self.circleShape = new p2.Circle({radius:self.radius});
        self.circleBody.addShape(self.circleShape);

        //CLASS METHODS
        self.update = function(){
            self.updatePosition();
            self.updateSpeed();
            self.calculateAngle();
            self.shootingCheck();
            self.potionCheck();
            self.specialCheck();
        };
        
        self.shootBullet = function(angle){
            new Bullet(angle, self.position.x, self.position.z, false, self.weapon, self.attackDamage, world);
        };

        self.shootingCheck = function(){
            if (self.input.mouse && self.shootingCD) {
                self.shootingCD = false;
                self.shootBullet(self.lookingAt);

                self.cooldownInterval = setInterval(() => {
                    self.shootingCD = true;
                    clearInterval(self.cooldownInterval);
                }, self.weapon.cooldown);
            }
        }

        self.calculateAngle = function(){
            let x = self.mousePosition.x - _WIDTH/2;
            let y = self.mousePosition.y - _HEIGHT/2;
            self.lookingAt = (Math.atan2(-x, -y) / Math.PI * 180 + 90).toFixed(2);
        };

        self.recieveDamage = function(damage){
            self.currentHP -= damage;

            if (self.currentHP <= 0){
                self.currentHP = 0;
                self.die();
            }
        }

        self.getScore = function(points){
            self.score += points;
            if(self.score >= self.level * 10){
                self.levelUp();
            }
        }

        self.levelUp = function(){
            self.level++;
            self.recoverHP(); self.recoverHP();
            self.recoverMana(); self.recoverMana();
        }

        self.die = function(){}

        self.changeWeapon = function(weaponLoot){
            self.weapon = weaponLoot;
        }

        self.recoverHP = function(){
            self.currentHP += 50;
            if (self.currentHP > self.maxHP)
                self.currentHP = self.maxHP;
            return true;
        }
        self.recoverMana = function(){
            self.currentMana += 50;
            if (self.currentMana > self.maxMana)
                self.currentMana = self.maxMana;
            return true;
        }
 
        self.getItemHP = function(){
            if (self.healPotions < 5){
                self.healPotions++;
                return true;
            }
            else{
                return false;
            }
        }
        self.getItemMana = function(){
            if (self.manaPotions < 5){
                self.manaPotions++;
                return true;
            }
            else{
                return false;
            }
        }

        self.potionCheck = function(){
            if (self.input.e)
                if (self.healPotionCD && self.healPotions > 0){
                    self.healPotionCD = false;
                    self.healPotions--;
                    self.recoverHP();
        
                    self.itemIntervalHP = setInterval(() => {
                        self.healPotionCD = true;
                        clearInterval(self.itemIntervalHP);
                    }, 1000 * 5);
                }

            if (self.input.r)
                if (self.manaPotionCD && self.manaPotions > 0){
                    self.manaPotionCD = false;
                    self.manaPotions--;
                    self.recoverMana();
                    
                    self.itemIntervalMana = setInterval(() => {
                        self.manaPotionCD = true;
                        clearInterval(self.itemIntervalMana);
                    }, 1000 * 5);
                }
        }

        self.specialCheck = function(){            
            if (self.input.special && self.weapon.activeSkill)
                if (self.specialCD && self.currentMana > 24){
                    self.specialCD = false;
                    self.currentMana -= 20;
                    self.weapon.activeSkill(Bullet, self, world);
                    
                    self.specialInterval = setInterval(() => {
                        self.specialCD = true;
                        clearInterval(self.specialInterval);
                    }, 1000 * 3);
                }
        }

        self.updateSpeed = function(){
            if (self.input.d)
                self.circleBody.velocity[0] = self.movSpeed;
            else if (self.input.a)
                self.circleBody.velocity[0] = -self.movSpeed;
            else
                self.circleBody.velocity[0] = 0;

            if (self.input.w)
                self.circleBody.velocity[1] = self.movSpeed;
            else if (self.input.s)
                self.circleBody.velocity[1] = -self.movSpeed;
            else
                self.circleBody.velocity[1] = 0;

            if(self.circleBody.velocity[0] != 0 && self.circleBody.velocity[1] != 0){
                let signX = Math.sign(self.circleBody.velocity[0]);
                let signY = Math.sign(self.circleBody.velocity[1]);
                self.circleBody.velocity[0] = signX * Math.sqrt(self.movSpeed * self.movSpeed / 2);
                self.circleBody.velocity[1] = signY * Math.sqrt(self.movSpeed * self.movSpeed / 2);
            }
        };

        self.getInitPack = function(){
            return{
                id: self.id,
                model: "wizard",
                position: {'x':self.position.x, 'z':self.position.z},
                lookingAt: self.lookingAt,
                hp: self.maxHP,
                
            }
        }

        self.getUpdatePack = function(){
            return{
                id: self.id,
                position: {'x':self.position.x, 'z':self.position.z},
                lookingAt: self.lookingAt,
                hp: self.currentHP,
                mana: self.currentMana,
                hpPotions: self.healPotions,
                manaPotions: self.manaPotions,
                score: self.score,
                level: self.level
            }
        }

        //Add it to the game
        world.addBody(self.circleBody);
        Player.list[self.id] = self;
        Entity.list[self.id] = self;
        Entity.initPack.push(self.getInitPack());
        return self;
    }

    //STATIC METHODS
    static onConnect(socket, weapon, allTriggers, World) {
        let player = new Player(socket.id, 100, 100, weapon, World);
        
        socket.on('keyPress', function (data) {
            if (data.inputId === 'leftClick')
                player.input.mouse = data.state;
            else if (data.inputId === 'left')
                player.input.a = data.state;
            else if (data.inputId === 'down')
                player.input.s = data.state;
            else if (data.inputId === 'right')
                player.input.d = data.state;
            else if (data.inputId === 'up')
                player.input.w = data.state;
            else if (data.inputId === 'heal')
                player.input.e = data.state;
            else if (data.inputId === 'mana')
                player.input.r = data.state;
            else if (data.inputId === 'special')
                player.input.special = data.state;
        });
        socket.on('mouseMove', function (data) {
            player.mousePosition.x = data.x;
            player.mousePosition.y = data.y;
        });

        player.die = function(){
            socket.emit('gameOver', player.score);
            player.input.d = player.input.a = player.input.w = player.s = false;
            player.isAlive = false;
        }
        socket.emit('sendSelfID', socket.id);
        socket.emit('loadWorld', World.blocks, World.map);
        socket.emit('init', Entity.getAllEntities(), allTriggers);
    }

    static onDisconnect(socket, World) {
        let player = Player.list[socket.id];
        if(player){
            player.circleBody.removeShape(player.circleShape);
            World.removeBody(player.circleBody);
            Entity.removePack.push(socket.id);
            
            delete Entity.list[socket.id];
            delete Player.list[socket.id];
            delete this;
        }
    }

    static getAllPlayers() {
        let players = [];
        for (let i in Player.list)
            players.push(Player.list[i].getInitPack());
        return players;
    }
}

Player.list = {};

//EXPORTS
module.exports = Player;