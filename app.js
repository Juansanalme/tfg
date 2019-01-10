


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
        self.update = function () {
            self.updateSpd();
            super_update();
            self.calculateAngle();
            if (self.pressingLeftClick) {
                self.shootBullet(self.lookingAt);
            }
        };
        self.calculateAngle = function () {
            var x = self.mousePosition.x - self.position.x;
            var y = self.mousePosition.y - self.position.y;
            self.lookingAt = Math.atan2(y, x) / Math.PI * 180;
        };
        self.shootBullet = function (angle) {
            var bullet = new Bullet(angle);
            bullet.position.x = self.position.x;
            bullet.position.y = self.position.y;
        };
        self.updateSpd = function () {
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
        Player.list[self.id] = self;
        return self;
    }
    static onConnect(socket) {
        var player = new Player(socket.id);
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

        playerInitPack.push({
            id: player.id,
            position: player.position,
            lookingAt: player.lookingAt,
        });
    }
    static onDisconnect(socket) {
        delete Player.list[socket.id];
        playerRemovePack.push(socket.id);
    }
    static update() {
        var pack = [];
        for (var i in Player.list) {
            var player = Player.list[i];
            player.update();
            pack.push({
                id: player.id,
                position: player.position,
                lookingAt: player.lookingAt,
            });
        }
        return pack;
    }
}
Player.list = {};

let triggerID = 0;
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
        Bullet.list[self.id] = self;
        bulletInitPack.push({
            id: self.id,
            position: self.position,
            lookingAt: self.lookingAt,
        });
        return self;
    }
    static update() {
        var pack = [];
        for (var i in Bullet.list) {
            var bullet = Bullet.list[i];
            bullet.update();
            if (bullet.toRemove) {
                delete Bullet.list[i];
                bulletRemovePack.push(bullet.id);
            }
            else {
                pack.push({
                    id: bullet.id,
                    position: bullet.position,
                    lookingAt: bullet.lookingAt,
                });
            }
        }
        return pack;
    }
}
Bullet.list = {};

//SOCKET.IO
let entityID = 0;
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


var playerInitPack = [];
var bulletInitPack = [];
var playerRemovePack = [];
var bulletRemovePack = [];

//GAME LOOP
setInterval(function(){

    var playerUpdatePack = [];
    playerUpdatePack.push(Player.update());
    var bulletUpdatePack = [];
    bulletUpdatePack.push(Bullet.update());

    for(var i in SOCKET_LIST){
        SOCKET_LIST[i].emit('init', i.id , playerInitPack, bulletInitPack);
        SOCKET_LIST[i].emit('update', playerUpdatePack, bulletUpdatePack);
        SOCKET_LIST[i].emit('remove', playerRemovePack, bulletRemovePack);
    }

    bulletRemovePack = [];
    playerRemovePack = [];
    bulletInitPack = [];
    playerInitPack = [];

},1000/25);//25 frames per second