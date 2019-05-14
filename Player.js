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
        self.input = {d:false, a:false, w:false, s:false, mouse:false};
        self.mousePosition = {x:0, y:0};
        self.attackDamage = 25;
        self.weapon = weapon;
        self.shootingCD = true;
        self.cooldownInterval;

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
        }

        self.changeWeapon = function(weaponLoot){
            self.weapon = weaponLoot;
        }

        self.recoverHP = function(){

            return true;
        }

        self.recoverMana = function(){

            return true;
        }

        self.getItemHP = function(){

            return true;
        }

        self.getItemMana = function(){

            return true;
        }

        self.updateSpeed = function(){
            if (self.input.d)
                self.circleBody.velocity[0] = 10;
            else if (self.input.a)
                self.circleBody.velocity[0] = -10;
            else
                self.circleBody.velocity[0] = 0;

            if (self.input.w)
                self.circleBody.velocity[1] = 10;
            else if (self.input.s)
                self.circleBody.velocity[1] = -10;
            else
                self.circleBody.velocity[1] = 0;

            if(self.circleBody.velocity[0] != 0 && self.circleBody.velocity[1] != 0){
                let signX = Math.sign(self.circleBody.velocity[0]);
                let signY = Math.sign(self.circleBody.velocity[1]);
                self.circleBody.velocity[0] = signX * Math.sqrt(50);
                self.circleBody.velocity[1] = signY * Math.sqrt(50);
            }
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

        //Add it to the game
        world.addBody(self.circleBody);
        Player.list[self.id] = self;
        Entity.list[self.id] = self;
        Entity.initPack.push(self.getInitPack());
        return self;
    }

    //STATIC METHODS
    static onConnect(socket, weapon, allTriggers, World) {
        let player = new Player(socket.id, 22, 22, weapon, World);
        
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
        });
        socket.on('mouseMove', function (data) {
            player.mousePosition.x = data.x;
            player.mousePosition.y = data.y;
        });

        socket.emit('loadWorld', World.blocks, World.map);
        socket.emit('sendSelfID', socket.id);
        socket.emit('init', Entity.getAllEntities(), allTriggers);
    }

    static onDisconnect(socket, World) {
        let player = Player.list[socket.id];
        player.circleBody.removeShape(player.circleShape);
        World.removeBody(player.circleBody);
        Entity.removePack.push(socket.id);
        
        delete Entity.list[socket.id];
        delete Player.list[socket.id];
        delete this;
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