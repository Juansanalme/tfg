
//EXPRESS
const express = require('express');
const app = express();
const serv = require('http').Server(app);

app.get('/',function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server Started');

//GAME 
let id = 0;

let SOCKET_LIST = {};
let PLAYER_LIST = {};

let Player = function(id){
    var self = {
        x:200, y:200, id:id,
        pressingR:false, pressingL:false, pressingU:false, pressingD:false,
        speed:6
    }
    self.updatePosition = function(){
        if(self.pressingR) self.x += self.speed;
        if(self.pressingL) self.x -= self.speed;
        if(self.pressingU) self.y -= self.speed;
        if(self.pressingD) self.y += self.speed;
    }
    return self;
}

//SOCKET.IO
const io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    console.log('socket connection, id = ' + id);
    
    socket.id = id;
    SOCKET_LIST[id] = socket;
    let player = Player(id);
    PLAYER_LIST[id] = player;

    id++;
    socket.on('disconnect',function(){
        console.log('socket disconnection, id = ' + socket.id);
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });
    
    socket.on('keyPress', function(data){
        if(data.inputId === 'left') player.pressingL = data.state;
        else if(data.inputId === 'right') player.pressingR = data.state;
        else if(data.inputId === 'up') player.pressingU = data.state;
        else if(data.inputId === 'down') player.pressingD = data.state;
    })
});

setInterval(function(){
    //collect packs of info
    var pack = [];
    for(var i in PLAYER_LIST){
        var player = PLAYER_LIST[i];
        player.updatePosition();
        pack.push({
            id:player.id, x:player.x, y:player.y
        });
    }

    //send packs
    for(var i in SOCKET_LIST){
        SOCKET_LIST[i].emit('update', pack);
    }

},1000/25);//25 frames per second