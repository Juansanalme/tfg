
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
        position: {'x':200, 'y':200},
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

var Player = function(id){
    var self = Entity();
    self.id = id;
    self.maxSpeed = 10;
    self.pressingR = false;
    self.pressingL = false;
    self.pressingU = false;
    self.pressingD = false;
    self.pressingLeftClick = false;
    self.mousePosition = {x:0, y:0};

    var super_update = self.update;
    self.update = function(){
        self.updateSpd();
        super_update();

        self.calculateAngle();
        
        if(self.pressingLeftClick){
            self.shootBullet(self.lookingAt);
        }
    }

    self.calculateAngle = function(){
        var x = self.mousePosition.x - self.position.x;
        var y = self.mousePosition.y - self.position.y;
        self.lookingAt = Math.atan2(y, x) / Math.PI * 180;  
    }

    self.shootBullet = function(angle){
        var bullet = Bullet(angle);
        bullet.position.x = self.position.x;
        bullet.position.y = self.position.y;
    }

    self.updateSpd = function(){
        if(self.pressingR)      self.speed.x = self.maxSpeed;
        else if(self.pressingL) self.speed.x = -self.maxSpeed;
        else                    self.speed.x = 0;

        if(self.pressingU)      self.speed.y = -self.maxSpeed;
        else if(self.pressingD) self.speed.y = self.maxSpeed;
        else                    self.speed.y = 0;
    }

    Player.list[self.id] = self;
    return self;
}
Player.list = {};
Player.onConnect = function(socket){
    var player = Player(socket.id);

    socket.on('keyPress', function(data){
        if(data.inputId === 'leftClick')  player.pressingLeftClick = data.state;
        else if(data.inputId === 'left')  player.pressingL = data.state;
        else if(data.inputId === 'down')  player.pressingD = data.state;
        else if(data.inputId === 'right') player.pressingR = data.state;
        else if(data.inputId === 'up')    player.pressingU = data.state;
    })
    socket.on('mouseMove', function(data){
        player.mousePosition.x = data.x;
        player.mousePosition.y = data.y;
    })
}
Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
}
Player.update = function(){
    var pack = [];
    for(var i in Player.list){
        var player = Player.list[i];
        player.update();
        pack.push({
            id: player.id,
            pos: player.position,
            lookingAt: player.lookingAt,
        });
    }
    return pack;
}

var bulletID = 0;
var Bullet = function(angle){
    var self = Entity();
    self.id = bulletID++;
    self.lookingAt = angle;
    self.speed.x = Math.cos(angle/180*Math.PI) * 10;
    self.speed.y = Math.sin(angle/180*Math.PI) * 10;
    self.timer = 0;
    self.toRemove = false;

    var super_update = self.update;
    self.update = function(){
        if (self.timer++ > 100)
            self.toRemove = true;
        super_update();
    }

    Bullet.list[self.id] = self;
    return self;
}
Bullet.list = {};
Bullet.update = function(){
    var pack = [];
    for(var i in Bullet.list){
        var bullet = Bullet.list[i];
        bullet.update();
        if(bullet.toRemove){
            delete Bullet.list[i];
        }
        else{
            pack.push({
                pos: bullet.position,
                lookingAt: bullet.lookingAt,
            });
        }
    }
    return pack;
}

//SOCKET.IO
let socketID = 1;
var SOCKET_LIST = {};

const io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    console.log('socket connection, id = ' + socketID);
    
    socket.id = socketID;
    SOCKET_LIST[socketID] = socket;
    Player.onConnect(socket);
    socketID++;

    socket.on('disconnect',function(){
        console.log('socket disconnection, id = ' + socket.id);
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
});

//GAME LOOP
setInterval(function(){

    var packs = {
        player: Player.update(),
        bullet: Bullet.update(),
    }

    for(var i in SOCKET_LIST){
        SOCKET_LIST[i].emit('update', packs);
    }

},1000/25);//25 frames per second