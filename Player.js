const p2 = require('p2');
const Entity = require ('./EntityManager');
const Event = require ('./EventManager');

const _WIDTH  = 1280,
      _HEIGHT = 720;

class Player {
    constructor(id, x, z, world) {
        var self = Entity.Entity(id, x, z);
        self.isPlayer = true;

        //CLASS PROPERTIES
        self.input = {d:false, a:false, w:false, s:false, mouse:false};
        self.mousePosition = {x:0, y:0};
        self.shootingCD = true;
        self.shootingTimeCD = 250;
        self.cooldownInterval;

        //p2 BODY
        self.circleBody = new p2.Body({
            mass: 5,
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
            self.shootingCheck();            
        };
        self.updatePosition = function(){
            self.position.x = self.circleBody.position[0];            
            self.position.z = self.circleBody.position[1];
        }
        
        self.shootBullet = function(angle){
            new Event.Bullet(angle, self.position.x, self.position.z, false, world);
        };

        self.shootingCheck = function(){
            if (self.input.mouse && self.shootingCD) {
                self.shootingCD = false;
                self.shootBullet(self.lookingAt);

                self.cooldownInterval = setInterval(() => {
                    self.shootingCD = true;
                    clearInterval(self.cooldownInterval);
                }, self.shootingTimeCD);
            }
        }

        self.calculateAngle = function(){
            let x = self.mousePosition.x - _WIDTH/2;
            let y = self.mousePosition.y - _HEIGHT/2;
            self.lookingAt = (Math.atan2(-x, -y) / Math.PI * 180 + 90).toFixed(2);
        };

        self.recieveDamage = function(){
            console.log(x);
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

        Player.list[self.id] = self;
        Player.initPack.push(self.getInitPack());
        return self;
    }

    //STATIC METHODS

    static onConnect(socket, World, enemies) {
        let player = new Player(socket.id, 22, 22, World);
        
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
        socket.emit('init', Player.getAllPlayers(), Event.Bullet.getAllBullets(), enemies);
        socket.emit('sendSelfID', socket.id);
    }

    static onDisconnect(socket, World) {
        World.removeBody(Player.list[socket.id].circleBody);
        delete Player.list[socket.id];
        Player.removePack.push(socket.id);
    }

    static getAllPlayers() {
        let players = [];
        for (let i in Player.list)
            players.push(Player.list[i].getInitPack());
        return players;
    }

    static getUpdate() {
        let pack = [];
        for (let i in Player.list) {
            let player = Player.list[i];
            player.update();
            pack.push(player.getUpdatePack());
        }
        return pack;
    }

    static getFrameUpdateData() {
        let packs = {
            init:   Player.initPack,
            remove: Player.removePack,           
            update: Player.getUpdate(),
        }
        Player.emptyPacks();
        return packs;
    }

    static emptyPacks() {
        Player.initPack = [];
        Player.removePack = [];
    }
}
//STATIC VARIABLES
Player.list = {};
Player.initPack = [];
Player.removePack = [];

//EXPORTS
module.exports = Player;