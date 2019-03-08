const _WIDTH  = 1280,
      _HEIGHT = 720;

var canvas, engine, scene, camera;
var socket = io();

function loadCanvas() {
    canvas = document.getElementById('canvas');
    canvas.width = _WIDTH;
    canvas.height = _HEIGHT;
    
    engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    scene = createScene(); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () { 
        scene.render();
    });
}

//SCENE
var createScene = function () {

    // Create the scene space
    let scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(-10,40,0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    //camera.attachControl(canvas, false);

    // Add lights to the scene
    let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    scene.preventDefaultOnPointerDown = false;

    return scene;
};

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
    updatePackType(entitiesPack, 0);
    updatePackType(triggersPack, 1);
});

//REMOVE
socket.on('remove', function(entitiesPack, triggersPack){
    removePackType(entitiesPack, Entity.list);
    removePackType(triggersPack, Trigger.list);
});

function initPackType(pack, type){
    pack.forEach(element => {
        let v;
        switch (type){
            case 0:
                if(!Entity.list[element.id]){
                    v = new Entity(element, scene);
                    Entity.list[v.id] = v;
                }
            break;
            case 1:
                if(!Trigger.list[element.id]){
                    v = new Trigger(element, scene);
                    Trigger.list[v.id] = v;
                }
            break;
        }
    });
}

function updatePackType(pack, type){
    pack.forEach(element => {
        let v;
        switch (type){
            case 0:
                v = Entity.list[element.id];
                if (v){
                    if (v.id == selfID){
                        camera.position.x = element.position.x -10;
                        camera.position.z = element.position.z;
                    }
                }  
            break;
            case 1:
                v = Trigger.list[element.id];
            break;
        }
        if (v.body !== undefined) {
            v.body.position.x = element.position.x;
            v.body.position.z = element.position.z;
        }
        if (v.lookingAt !== undefined) {
            v.lookingAt = element.lookingAt;
        }
    });
}

function removePackType(pack, typeList){
    pack.forEach(element => {
        typeList[element].body.dispose();
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

function mouseEvent(bool) {
    socket.emit('keyPress', {inputId:'leftClick', state:bool});
}

function getMousePosition(evt) {
    let rect = canvas.getBoundingClientRect();
    return{
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}
