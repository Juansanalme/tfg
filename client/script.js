const _WIDTH  = 1280,
      _HEIGHT = 720;

var canvas, engine, scene, camera;
var mousePosition = {x:0,y:0};
var socket = io();

function loadCanvas() {
    canvas = document.getElementById('canvas');
    canvas.width = _WIDTH;
    canvas.height = _HEIGHT;
    
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();

    var assetsManager = new BABYLON.AssetsManager(scene);

    loadMeshes(assetsManager);
    loadSprites(scene);

	assetsManager.onFinish = function(){
        socket.emit('dataLoaded');

		engine.runRenderLoop(function(){
			scene.render();
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
            removePackType(entitiesPack, 0);
            removePackType(triggersPack, 1);
        });
    };
    
	assetsManager.load();
}

//SCENE
var createScene = function () {

    let scene = new BABYLON.Scene(engine);
    engine.enableOfflineSupport = false;
    scene.clearColor = new BABYLON.Color3.White();

    camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0,30,-10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

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

//LOAD WORLD
socket.on('loadWorld', function(worldBlocks, worldMap){
    loadWorld(worldBlocks, worldMap, scene);
});

setInterval(function(){
    socket.emit('mouseMove', mousePosition);
},100/6);

function initPackType(pack, type){
    pack.forEach(element => {
        switch (type){
            case 0:
                if(!Entity.list[element.id]){
                    let v = new Entity(element);
                    Entity.list[v.id] = v;
                }
            break;
            case 1:
                if(!Trigger.list[element.id]){
                    let v = new Trigger(element);
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
                        camera.position.x = element.position.x;
                        camera.position.z = element.position.z -10;
                        if(element.hp && v.currentHp){
                            v.currentHp = element.hp;
                        }
                    }
                }  
            break;
            case 1:
                v = Trigger.list[element.id];
            break;
        }
        if (v){
            let angle = -1 * element.lookingAt * Math.PI / 180 ; //to radians
            let axis = new BABYLON.Vector3(0, 1, 0);
            let quaternion = new BABYLON.Quaternion.RotationAxis(axis, angle - Math.PI/2);
            v.lookingAt = angle;

            if (v.body !== undefined) {
                v.body.position.x = element.position.x;
                v.body.position.z = element.position.z;
                v.body.rotationQuaternion = quaternion;
            }
            if (v.sprite !== undefined) {
                v.sprite.position.x = element.position.x;
                v.sprite.position.z = element.position.z;
                v.sprite.angle = -angle - Math.PI/2; 
            }
        }
    });
}

function removePackType(pack, type){
    pack.forEach(element => {
        switch (type){
            case 0:
                if(Entity.list[element]){
                    Entity.list[element].body.dispose();
                    delete Entity.list[element];
                }
            break;
            case 1:
                if(Trigger.list[element]){
                    delete Trigger.list[element].sprite.dispose();
                    delete Trigger.list[element];
                }
            break;
        }            
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
    mousePosition = getMousePosition(evt);
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