const _WIDTH  = 1280,
      _HEIGHT = 720;

var canvas, ctx;
var socket = io();

function loadCanvas() {
    canvas = document.getElementById('canvas');
    canvas.width = _WIDTH;
    canvas.height = _HEIGHT;
    ctx = canvas.getContext('2d');
}

var img = {};
img.player = new Image();
img.player.src = '/client/player.png';
img.bullet = new Image();
img.bullet.src = '/client/bullet.png';
img.map = new Image();
img.map.src = '/client/map.png';

//GAME DATA
var selfID = null;

socket.on('sendSelfID', function(socketID){
    selfID = socketID;
});

//INIT
socket.on('init', function(entitiesPack, triggersPack){
    initPackType(entitiesPack, 0);
    initPackType(triggersPack, 1);
});

//UPDATE
socket.on('update', function(entitiesPack, triggersPack){
    updatePackType(entitiesPack, Entity.list);
    updatePackType(triggersPack, Trigger.list);
});

//REMOVE
socket.on('remove', function(entitiesPack, triggersPack){
    removePackType(entitiesPack, Entity.list);
    removePackType(triggersPack, Trigger.list);
});

//GAME LOOP
setInterval(function(){
    if(selfID){
        ctx.clearRect(0, 0, _WIDTH, _HEIGHT);
        let x = _WIDTH/2  - Entity.list[selfID].position.x;
        let y = _HEIGHT/2 - Entity.list[selfID].position.y;
        ctx.drawImage(img.map, x, y);
        
        for (let i in Entity.list){
            drawObject(Entity.list[i],img.player);
        };

        for (let i in Trigger.list){
            drawObject(Trigger.list[i],img.bullet);
        };
    }
});

function drawObject(e, imgType){
    ctx.save();
    let x = e.position.x - Entity.list[selfID].position.x + _WIDTH/2;
    let y = e.position.y - Entity.list[selfID].position.y + _HEIGHT/2;;
    if (e.id == selfID){
        x = _WIDTH/2;
        y = _HEIGHT/2;
    }
    ctx.translate(x, y);
    ctx.rotate((e.lookingAt+90)*Math.PI/180);
    ctx.drawImage(imgType, -imgType.width/2, -imgType.height/2);
    ctx.restore();		
}

function initPackType(pack, type){
    pack.forEach(element => {
        let v;
        switch (type){
            case 0:
                v = new Entity(element);
                Entity.list[v.id] = v;
            break;
            case 1:
                v = new Trigger(element);
                Trigger.list[v.id] = v;
            break;
        }
    });
}

function updatePackType(pack, typeList){
    pack.forEach(element => {
        let v = typeList[element.id];
        if (v){
            if (v.position !== undefined) v.position = element.position;
            if (v.lookingAt !== undefined) v.lookingAt = element.lookingAt;
        }   
    });
}

function removePackType(pack, typeList){
    pack.forEach(element => {
        delete typeList[element];
    });
}

//DOCUMENT EVENTS
document.onkeydown = function(evt){
    keyEvent(evt,true);
}
document.onkeyup = function(evt){
    keyEvent(evt,false);
}
document.onmousedown = function(){
    mouseEvent(true);
}
document.onmouseup = function(){
    mouseEvent(false);
}
document.onmousemove = function(evt){
    let mousePosition = getMousePosition(evt);
    socket.emit('mouseMove', mousePosition);
}

function keyEvent(evt, bool) {
    if     (evt.keyCode === 68) socket.emit('keyPress', {inputId:'right', state:bool}); //d
    else if(evt.keyCode === 83) socket.emit('keyPress', {inputId:'down',  state:bool}); //s
    else if(evt.keyCode === 65) socket.emit('keyPress', {inputId:'left',  state:bool}); //a
    else if(evt.keyCode === 87) socket.emit('keyPress', {inputId:'up',    state:bool}); //w
}

function mouseEvent(bool){
    socket.emit('keyPress', {inputId:'leftClick', state:bool});
}

function getMousePosition(evt) {
    let rect = canvas.getBoundingClientRect();
    return{
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}
