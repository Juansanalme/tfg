//module exports
const p2 = require('p2');
const Player = require('./EntityManager');
const Bullet = require('./EventManager');

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

//SOCKET.IO
var entityID = 1;
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

//p2 WORLD
var world = new p2.World({
    gravity:[0, 0]
});

//GAME LOOP
setInterval(function(){

    let playerPacks = Player.getFrameUpdateData();
    let bulletPacks = Bullet.getFrameUpdateData();

    for(let i in SOCKET_LIST){
        //if (SOCKET_LIST[i] && typeof SOCKET_LIST[i].emit === "function" && SOCKET_LIST[i].emit){
            if (SOCKET_LIST[i]) SOCKET_LIST[i].emit('init',   playerPacks.init,   bulletPacks.init);
            if (SOCKET_LIST[i]) SOCKET_LIST[i].emit('update', playerPacks.update, bulletPacks.update);
            if (SOCKET_LIST[i]) SOCKET_LIST[i].emit('remove', playerPacks.remove, bulletPacks.remove);
        //}
    }

},1000/25);//25 frames per second