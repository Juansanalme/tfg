//module exports
const World = require('./WorldManager');
const Entity = require('./EntityManager');
const Event = require('./EventManager');
const Enemy = require('./Enemy');
const Player = require('./Player');

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

//load World
console.log('Loading World...');
World.load();

//SOCKET.IO
var SOCKET_LIST = {};

const io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    console.log('socket connection, id = ' + Entity.getID());
    
    socket.id = Entity.getID();
    SOCKET_LIST[socket.id] = socket;
    Player.onConnect(socket, World, Enemy.getAllEnemies());

    socket.on('disconnect',function(){
        console.log('socket disconnection, id = ' + socket.id);
        Player.onDisconnect(socket, World);
        SOCKET_LIST[socket.id].toDelete = true;
    });
});

//GAME LOOP
const timeStep = 1 / 60;
setInterval(function(){

    World.step(timeStep);
    Event.Trigger.update(Entity.list, World.blocks);

    let playerPacks = Player.getFrameUpdateData();
    let bulletPacks = Event.Bullet.getFrameUpdateData();
    let enemyPacks  = Enemy.getFrameUpdateData();

    for(let i in SOCKET_LIST){
        SOCKET_LIST[i].emit('init',   playerPacks.init,   bulletPacks.init,   enemyPacks.init);
        SOCKET_LIST[i].emit('update', playerPacks.update, bulletPacks.update, enemyPacks.update);
        SOCKET_LIST[i].emit('remove', playerPacks.remove, bulletPacks.remove, enemyPacks.remove);

        if (SOCKET_LIST[i] && SOCKET_LIST[i].toDelete){
            delete SOCKET_LIST[i];
            console.log('socket with id = ' + i + ' deleted');
        }
    }

},1000 * timeStep);
//timestep^-1 times per second