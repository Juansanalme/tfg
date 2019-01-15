const Bullet = require ('./EventManager');

const _WIDTH  = 1280,
      _HEIGHT = 720;

var Entity = function(){
    var self = {
        id:'',
        position: {'x':1280/2, 'y':720/2},
        lookingAt: 0,
        speed: {'x':0, 'y':0},
    }
    self.update = function(){
        self.updatePosition();
    }
    self.updatePosition = function(){
        self.position.x += self.speed.x;
        self.position.y += self.speed.y;
    }
    return self;
}

class Player {
    constructor(id) {
        var self = Entity();
        self.id = id;
        self.maxSpeed = 10;
        self.pressingR = false;
        self.pressingL = false;
        self.pressingU = false;
        self.pressingD = false;
        self.pressingLeftClick = false;
        self.mousePosition = { x: 0, y: 0 };
        var super_update = self.update;
        self.update = function(){
            self.updateSpd();
            super_update();
            self.calculateAngle();
            if (self.pressingLeftClick) {
                self.shootBullet(self.lookingAt);
            }
        };
        self.calculateAngle = function(){
            let x = self.mousePosition.x - _WIDTH/2;
            let y = self.mousePosition.y - _HEIGHT/2;
            self.lookingAt = Math.atan2(y, x) / Math.PI * 180;
        };
        self.shootBullet = function(angle){
            let bullet = new Bullet(angle);
            bullet.position.x = self.position.x;
            bullet.position.y = self.position.y;
        };
        self.updateSpd = function(){
            if (self.pressingR)
                self.speed.x = self.maxSpeed;
            else if (self.pressingL)
                self.speed.x = -self.maxSpeed;
            else
                self.speed.x = 0;
            if (self.pressingU)
                self.speed.y = -self.maxSpeed;
            else if (self.pressingD)
                self.speed.y = self.maxSpeed;
            else
                self.speed.y = 0;
        };

        self.getInitPack = function(){
            return{
                id: self.id,
                position: self.position,
                lookingAt: self.lookingAt,
            }
        }
        self.getUpdatePack = function(){
            return{
                id: self.id,
                position: self.position,
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
                player.pressingLeftClick = data.state;
            else if (data.inputId === 'left')
                player.pressingL = data.state;
            else if (data.inputId === 'down')
                player.pressingD = data.state;
            else if (data.inputId === 'right')
                player.pressingR = data.state;
            else if (data.inputId === 'up')
                player.pressingU = data.state;
        });
        socket.on('mouseMove', function (data) {
            player.mousePosition.x = data.x;
            player.mousePosition.y = data.y;
        });

        socket.emit('sendSelfID', socket.id);
        socket.emit('init', Player.getAllPlayers(), Bullet.getAllBullets());
    }

    static onDisconnect(socket) {
        delete Player.list[socket.id];
        Player.removePack.push(socket.id);
    }

    static emptyPacks() {
        Player.initPack = [];
        Player.removePack = [];
    }
    static getInitPack() {
        return Player.initPack;
    }
    static getRemovePack() {
        return Player.removePack;
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

    static getAllPlayers() {
        let players = [];
        for (let i in Player.list)
            players.push(Player.list[i].getInitPack());
        return players;
    }
}

Player.list = {};
Player.initPack = [];
Player.removePack = [];

module.exports = Player ;