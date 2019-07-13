//module requires
const World = require('./WorldManager');
const Event = require('./EventManager');
const Entity = require('./EntityManager');
const Weapon = require('./WeaponManager');
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
    let id = Entity.getID();
    console.log('socket connection, id = ' + id);
    
    socket.id = id;
    SOCKET_LIST[socket.id] = socket;
        
    socket.on('dataLoaded',function(){
        Player.onConnect(socket, Weapon.sword, Event.getAllTriggers(), World);
    });

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
    Event.update(Entity.list, World.blocks);

    let entityPacks = Entity.getFrameUpdateData();
    let triggerPacks = Event.getFrameUpdateData();

    for(let i in SOCKET_LIST){
        SOCKET_LIST[i].emit('init',   entityPacks.init,   triggerPacks.init);
        SOCKET_LIST[i].emit('update', entityPacks.update, triggerPacks.update);
        SOCKET_LIST[i].emit('remove', entityPacks.remove, triggerPacks.remove);

        if (SOCKET_LIST[i] && SOCKET_LIST[i].toDelete){
            delete SOCKET_LIST[i];
            console.log('socket with id = ' + i + ' deleted');
        }
    }

},1000 * timeStep);
//timestep^-1 times per second