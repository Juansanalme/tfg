const Player = require ('./EntityManager');
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

//GAME LOOP
setInterval(function(){

    let playerUpdatePacks = Player.getUpdate();
    let BulletUpdatePacks = Bullet.getUpdate();

    for(let i in SOCKET_LIST){
        //if (SOCKET_LIST[i] && typeof SOCKET_LIST[i].emit === "function" && SOCKET_LIST[i].emit){
            if (SOCKET_LIST[i]) SOCKET_LIST[i].emit('init', Player.getInitPack(), Bullet.getInitPack());
            if (SOCKET_LIST[i]) SOCKET_LIST[i].emit('update', playerUpdatePacks, BulletUpdatePacks);
            if (SOCKET_LIST[i]) SOCKET_LIST[i].emit('remove', Player.getRemovePack(), Bullet.getRemovePack());
        //}
    }

    Player.emptyPacks();
    Bullet.emptyPacks();

},1000/25);//25 frames per second