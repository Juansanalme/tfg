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
//entitylist, triggers

var selfID = null;
Entity.list = {};

//INIT

socket.on('init',function(socketID){
    selfID = socketID;
});

//UPDATE
socket.on('update', function(data){
    ctx.clearRect(0, 0, _WIDTH, _HEIGHT);
    
    ctx.drawImage(img.map, 0, 0);

    data.player.forEach(function (e){
		drawObject(e,img.player);
    });
    
    data.bullet.forEach(function (e){
        drawObject(e,img.bullet);
    });
});

//REMOVE

function drawObject(e, imgType){
    ctx.save();
    ctx.translate(e.pos.x, e.pos.y);
    ctx.rotate((e.lookingAt+90)*Math.PI/180);
    ctx.drawImage(imgType, -imgType.width/2, -imgType.height/2);
    ctx.restore();		
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
    var mousePosition = getMousePosition(evt);
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
    var rect = canvas.getBoundingClientRect();
    return{
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}