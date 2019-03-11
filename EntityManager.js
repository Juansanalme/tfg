const p2 = require('p2');
const World = require('./WorldManager');
const Bullet = require ('./EventManager');

const _WIDTH  = 1280,
      _HEIGHT = 720;

var Entity = function(){
    var self = {
        id:'',
        //position: {'x':0, 'z':0},
        lookingAt: 0,
        //speed: {'x':0, 'z':0},
    }
    return self;
}

class Player {
    constructor(id) {
        var self = Entity();
        self.id = id;
        self.input = { d:false, a:false, w:false, s:false, mouse:false};
        self.mousePosition = { x: 0, y: 0 };

        // Create an empty dynamic body
        self.circleBody = new p2.Body({
            mass: 5,
            position: [0, 0]
        });
        
        // Add a circle shape to the body.
        self.circleShape = new p2.Box({height:1, width:1});
        self.circleBody.addShape(self.circleShape);
        
        // ...and add the body to the world.
        // If we don't add it to the world, it won't be simulated.
        World.addBody(self.circleBody);

        self.update = function(){
            self.updateSpd();
            self.calculateAngle();
            if (self.input.mouse) {
                self.shootBullet(self.lookingAt);
            }
        };
        self.calculateAngle = function(){
            let x = self.mousePosition.x - _WIDTH/2;
            let y = self.mousePosition.y - _HEIGHT/2;
            self.lookingAt = Math.atan2(-x, -y) / Math.PI * 180 + 90;
        };
        self.shootBullet = function(angle){
            new Bullet(angle, self.circleBody.position[0], self.circleBody.position[1]);
        };
        self.updateSpd = function(){
            if (self.input.d)
                self.circleBody.velocity[0] = 20;
            else if (self.input.a)
                self.circleBody.velocity[0] = -20;
            else
                self.circleBody.velocity[0] = 0;

            if (self.input.w)
                self.circleBody.velocity[1] = 20;
            else if (self.input.s)
                self.circleBody.velocity[1] = -20;
            else
                self.circleBody.velocity[1] = 0;
        };

        self.getInitPack = function(){
            return{
                id: self.id,
                position: {'x':self.circleBody.position[0], 'z':self.circleBody.position[1]},
                lookingAt: self.lookingAt,
            }
        }

        self.getUpdatePack = function(){
            return{
                id: self.id,
                position: {'x':self.circleBody.position[0], 'z':self.circleBody.position[1]},
                lookingAt: self.lookingAt,
            }
        }

        Player.list[self.id] = self;
        Player.initPack.push(self.getInitPack());
        return self;
    }

    static onConnect(socket) {
        let player = new Player(socket.id);
        
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
        socket.emit('init', Player.getAllPlayers(), Bullet.getAllBullets());
        socket.emit('sendSelfID', socket.id);
    }

    static onDisconnect(socket) {
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

Player.list = {};
Player.initPack = [];
Player.removePack = [];

module.exports = Player;