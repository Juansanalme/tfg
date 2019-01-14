
//EXPRESS
const express = require('express');
const app = express();
const serv = require('http').Server(app);

app.get('/',function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});
app.use(express.static(__dirname + '/client'));
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server Started');

//GAME 

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
        playerInitPack.push(self.getInitPack());
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
        playerRemovePack.push(socket.id);
    }
    static update() {
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

var triggerID = 0;
var Trigger = function(){
    var self = {
        id:'',
        position: {'x':0, 'y':0},
    }
    return self;
}

class Bullet {
    constructor(angle) {
        var self = Trigger();
        self.id = triggerID++;
        self.lookingAt = angle;
        self.speed = {'x':0,'y':0};
        self.speed.x = Math.cos(angle / 180 * Math.PI) * 10;
        self.speed.y = Math.sin(angle / 180 * Math.PI) * 10;
        self.timer = 0;
        self.toRemove = false;

        self.update = function () {
            if (self.timer++ > 60)
                self.toRemove = true;
            self.updatePosition();
        };
        self.updatePosition = function(){
            self.position.x += self.speed.x;
            self.position.y += self.speed.y;
        }
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
        Bullet.list[self.id] = self;
        bulletInitPack.push(self.getInitPack());
        return self;
    }
    static update() {
        let pack = [];
        for (let i in Bullet.list) {
            let bullet = Bullet.list[i];
            bullet.update();
            if (bullet.toRemove) {
                delete Bullet.list[i];
                bulletRemovePack.push(bullet.id);
            }
            else {
                pack.push(bullet.getUpdatePack());
            }
        }
        return pack;
    }
    static getAllBullets() {
        let bullets = [];
        for (let i in Bullet.list)
            bullets.push(Bullet.list[i].getInitPack());
        return bullets;
    }
}
Bullet.list = {};

//SOCKET.IO
var entityID = 0;
var SOCKET_LIST = {};

const io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    console.log('socket connection, id = ' + entityID);
    
    socket.id = entityID++;
    SOCKET_LIST[socket.id] = socket;
    Player.onConnect(socket);

    socket.on('disconnect',function(){
        console.log('socket disconnection, id = ' + socket.id);
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
});

//GAME LOOP

var playerInitPack = [];
var bulletInitPack = [];
var playerRemovePack = [];
var bulletRemovePack = [];

setInterval(function(){

    let playerUpdatePack = Player.update();
    let bulletUpdatePack = Bullet.update();

    for(let i in SOCKET_LIST){
        if (SOCKET_LIST[i]){
            SOCKET_LIST[i].emit('init'  , playerInitPack  , bulletInitPack);
            SOCKET_LIST[i].emit('update', playerUpdatePack, bulletUpdatePack);
            SOCKET_LIST[i].emit('remove', playerRemovePack, bulletRemovePack);
        }
    }

    bulletRemovePack = [];
    playerRemovePack = [];
    bulletInitPack = [];
    playerInitPack = [];

},1000/25);//25 frames per second