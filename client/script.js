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
    camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0,30,-10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    //camera.attachControl(canvas, false);

    // Add lights to the scene
    let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    scene.preventDefaultOnPointerDown = false;

    //showAxis(scene, 5);

    return scene;
};

//GAME DATA
var selfID = null;

socket.on('sendSelfID', function(socketID){
    selfID = socketID;
});

//LOAD WORLD
socket.on('loadWorld', function(worldBlocks, worldMap){

    let width = worldMap.groundWidth;
    let height = worldMap.groundHeight;

    let ground0 = BABYLON.MeshBuilder.CreateGround("ground", {height:height , width: width}, scene);
    let ground1= BABYLON.MeshBuilder.CreateGround("ground", {height:height , width: width}, scene);
    let ground2 = BABYLON.MeshBuilder.CreateGround("ground", {height:height , width: width}, scene);
    let ground3 = BABYLON.MeshBuilder.CreateGround("ground", {height:height , width: width}, scene);
    let ground4 = BABYLON.MeshBuilder.CreateGround("ground", {height:height , width: width}, scene);
    let myMaterial0 = new BABYLON.StandardMaterial("myMaterial", scene);
    let myMaterial1 = new BABYLON.StandardMaterial("myMaterial", scene);
    let myMaterial2 = new BABYLON.StandardMaterial("myMaterial", scene);
    let myMaterial3 = new BABYLON.StandardMaterial("myMaterial", scene);
    let myMaterial4 = new BABYLON.StandardMaterial("myMaterial", scene);
    let waterT = new BABYLON.Texture("./textures/waterTile.jpg", scene);
    let grassT = new BABYLON.Texture("./textures/grassTile.jpg", scene);
    let sandT = new BABYLON.Texture("./textures/sandTile.jpg", scene);
    let plankT = new BABYLON.Texture("./textures/plankTile.jpg", scene);
    let pathT = new BABYLON.Texture("./textures/pathTile.jpg", scene);

    myMaterial0.diffuseTexture = waterT;
    myMaterial0.specularTexture = waterT;
    myMaterial0.emissiveTexture = waterT;
    myMaterial0.ambientTexture = waterT;

    myMaterial1.diffuseTexture = grassT;
    myMaterial1.specularTexture = grassT;
    myMaterial1.emissiveTexture = grassT;
    myMaterial1.ambientTexture = grassT;

    myMaterial2.diffuseTexture = sandT;
    myMaterial2.specularTexture = sandT;
    myMaterial2.emissiveTexture = sandT;
    myMaterial2.ambientTexture = sandT;

    myMaterial3.diffuseTexture = plankT;
    myMaterial3.specularTexture = plankT;
    myMaterial3.emissiveTexture = plankT;
    myMaterial3.ambientTexture = plankT;

    myMaterial4.diffuseTexture = pathT;
    myMaterial4.specularTexture = pathT;
    myMaterial4.emissiveTexture = pathT;
    myMaterial4.ambientTexture = pathT;

    ground0.material = myMaterial0;
    ground1.material = myMaterial1;
    ground2.material = myMaterial2;
    ground3.material = myMaterial3;
    ground4.material = myMaterial4;

    ground0.position.x = -16;
    ground1.position.x = -16;
    ground2.position.x = -16;
    ground3.position.x = -16;
    ground4.position.x = -16;

    let y = worldMap.mapMatrix.length - 1;
    for(let i in worldMap.mapMatrix){

        for(let j in worldMap.mapMatrix[i]){
            
            let newInstance;

            switch(worldMap.mapMatrix[i][j]){
                case 0: 
                    newInstance = ground0.createInstance();
                    break;
                case 1:
                    newInstance = ground1.createInstance();
                    break;
                case 2:
                    newInstance = ground2.createInstance();
                    break;
                case 3:
                    newInstance = ground3.createInstance();
                    break;
                case 4:
                    newInstance = ground4.createInstance();
                    break;
            }
            
            newInstance.position.x = j * height + height/2;
            newInstance.position.z = y * width  + width/2;
        }
        y--;
    }

    worldBlocks.forEach(element => {
        //let block = BABYLON.MeshBuilder.CreateBox("box", {height: element.h, width: element.w, depth: element.d}, scene);
        //block.position.x = element.pX;
        //block.position.z = element.pZ;
        //block.position.y = element.h/2;
    });

});

//INIT
socket.on('init', function(entitiesPack, triggersPack, enemiesPack){
    initPackType(entitiesPack, 0);
    initPackType(enemiesPack, 0);
    initPackType(triggersPack, 1);
});

//UPDATE
socket.on('update', function(entitiesPack, triggersPack, enemiesPack){
    updatePackType(entitiesPack, 0);
    updatePackType(enemiesPack, 0);
    updatePackType(triggersPack, 1);
});

//REMOVE
socket.on('remove', function(entitiesPack, triggersPack, enemiesPack){
    removePackType(entitiesPack, 0);
    removePackType(enemiesPack, 0);
    removePackType(triggersPack, 1);
});

function initPackType(pack, type){
    pack.forEach(element => {
        switch (type){
            case 0:
                if(!Entity.list[element.id]){
                    let v = new Entity(element, scene);
                    Entity.list[v.id] = v;
                }
            break;
            case 1:
                if(!Trigger.list[element.id]){
                    let v = new Trigger(element, scene);
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
                    }
                }  
            break;
            case 1:
                v = Trigger.list[element.id];
            break;
        }

        let angle = -1 * element.lookingAt * Math.PI / 180; //to radians
        let axis = new BABYLON.Vector3(0, 1, 0);
        let quaternion = new BABYLON.Quaternion.RotationAxis(axis, angle);
        v.lookingAt = angle;

        if (v.body !== undefined) {
            v.body.position.x = element.position.x;
            v.body.position.z = element.position.z;
            v.body.rotationQuaternion = quaternion;
        }
        if (v.sprite !== undefined) {
            v.sprite.position.x = element.position.x;
            v.sprite.position.z = element.position.z;
            v.sprite.angle = -1 * angle + Math.PI; 
        }
    });
}

function removePackType(pack, type){
    pack.forEach(element => {
        switch (type){
            case 0:
                Entity.list[element].body.dispose();
                delete Entity.list[element];
            break;
            case 1:
                delete Trigger.list[element].sprite.dispose();
                delete Trigger.list[element];
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


// show axis
var showAxis = function(scene,size) {
    var makeTextPlane = function(text, color, size) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
    var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
    plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    return plane;
     };
  
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};