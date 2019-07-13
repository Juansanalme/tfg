
var wizard, griffin, werwolf, dragon, tree;
var spriteManSword, spriteManLance, spriteManAxe, spriteManArrow, spriteManDagger, spriteManMagic, spriteManBow, spriteManStaff, spriteManHealitem, spriteManManaitem, spriteHealpotion, spriteManManapotion;

function loadMeshes(assetsManager){
    let wizardMeshTask = assetsManager.addMeshTask("","","./models/","wizard.babylon");
    wizardMeshTask.onSuccess = function (task) {
        wizard = wizardMeshTask.loadedMeshes[0];
        wizard.isVisible = false;
    }
    let griffinMeshTask = assetsManager.addMeshTask("","","./models/","griffin_f.babylon");
    griffinMeshTask.onSuccess = function (task) {
        griffin = griffinMeshTask.loadedMeshes[0];
        griffin.isVisible = false;
    }
    let wolfMeshTask = assetsManager.addMeshTask("","","./models/","werwolf.babylon");
    wolfMeshTask.onSuccess = function (task) {
        werwolf = wolfMeshTask.loadedMeshes[0];
        werwolf.isVisible = false;
    }
    let dragonMeshTask = assetsManager.addMeshTask("","","./models/","3Hdragon.babylon");
    dragonMeshTask.onSuccess = function (task) {
        dragon = dragonMeshTask.loadedMeshes[0];
        dragon.isVisible = false;
    }
    let treeMeshTask = assetsManager.addMeshTask("","","./models/","tree.babylon");
    treeMeshTask.onSuccess = function (task) {
        tree = treeMeshTask.loadedMeshes[0];
        tree.isVisible = false;
    }
}

function getMesh(name){
    switch (name){
        case "wizard": return wizard.createInstance();
        case "griffin": return griffin.createInstance();
        case "werwolf": return werwolf.createInstance();
        case "dragon": return dragon.createInstance();
        case "tree": return tree.createInstance();
    }
}

function loadSprites(scene){   
    spriteManSword = new BABYLON.SpriteManager("", './textures/64/sword.png', 1000, {width: 64, height: 64}, scene);
    spriteManLance = new BABYLON.SpriteManager("", './textures/64/spear.png', 1000, {width: 64, height: 64}, scene);
    spriteManAxe = new BABYLON.SpriteManager("", './textures/64/axe.png', 1000, {width: 64, height: 64}, scene);
    spriteManArrow = new BABYLON.SpriteManager("", './textures/64/arrow.png', 1000, {width: 64, height: 64}, scene);
    spriteManDagger = new BABYLON.SpriteManager("", './textures/64/dagger.png', 1000, {width: 64, height: 64}, scene);
    spriteManMagic = new BABYLON.SpriteManager("", './textures/64/iceshard.png', 1000, {width: 64, height: 64}, scene);
    spriteManBow = new BABYLON.SpriteManager("", './textures/64/bow.png', 1000, {width: 64, height: 64}, scene);
    spriteManStaff = new BABYLON.SpriteManager("", './textures/64/staff.png', 1000, {width: 64, height: 64}, scene);
    spriteManHealitem = new BABYLON.SpriteManager("", './textures/32/healitem.png', 1000, {width: 32, height: 32}, scene);
    spriteManManaitem = new BABYLON.SpriteManager("", './textures/32/manaitem.png', 1000, {width: 32, height: 32}, scene);
    spriteHealpotion = new BABYLON.SpriteManager("", './textures/32/healpotion.png', 1000, {width: 32, height: 32}, scene);
    spriteManManapotion = new BABYLON.SpriteManager("", './textures/32/manapotion.png', 1000, {width: 32, height: 32}, scene);
}

function getSprite(name){
    switch (name){
        case "sword": return new BABYLON.Sprite("", spriteManSword);
        case "lance": return new BABYLON.Sprite("", spriteManLance);
        case "axe": return new BABYLON.Sprite("", spriteManAxe);
        case "arrow": return new BABYLON.Sprite("", spriteManArrow);
        case "dagger": return new BABYLON.Sprite("", spriteManDagger);
        case "iceshard": return new BABYLON.Sprite("", spriteManMagic);
        case "bow": return new BABYLON.Sprite("", spriteManBow);
        case "staff": return new BABYLON.Sprite("", spriteManStaff);
        case "healitem": return new BABYLON.Sprite("", spriteManHealitem);
        case "manaitem": return new BABYLON.Sprite("", spriteManManaitem);
        case "healpotion": return new BABYLON.Sprite("", spriteHealpotion);
        case "manapotion": return new BABYLON.Sprite("", spriteManManapotion);
    }
}

function loadWorld(worldBlocks, worldMap, scene){
    
    let width = worldMap.groundWidth;
    let height = worldMap.groundHeight;

    let ground0 = BABYLON.MeshBuilder.CreateGround("ground", {height:height , width: width}, scene);
    let ground1 = BABYLON.MeshBuilder.CreateGround("ground", {height:height , width: width}, scene);
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

    myMaterial0.diffuseTexture = myMaterial0.specularTexture = myMaterial0.emissiveTexture = myMaterial0.ambientTexture = waterT;
    myMaterial1.diffuseTexture = myMaterial1.specularTexture = myMaterial1.emissiveTexture = myMaterial1.ambientTexture = grassT;
    myMaterial2.diffuseTexture = myMaterial2.specularTexture = myMaterial2.emissiveTexture = myMaterial2.ambientTexture = sandT;
    myMaterial3.diffuseTexture = myMaterial3.specularTexture = myMaterial3.emissiveTexture = myMaterial3.ambientTexture = plankT;
    myMaterial4.diffuseTexture = myMaterial4.specularTexture = myMaterial4.emissiveTexture = myMaterial4.ambientTexture = pathT;

    ground0.material = myMaterial0;
    ground1.material = myMaterial1;
    ground2.material = myMaterial2;
    ground3.material = myMaterial3;
    ground4.material = myMaterial4;

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

    ground0.isVisible = ground1.isVisible = ground2.isVisible = ground3.isVisible = ground4.isVisible = false;

    worldBlocks.forEach(element => {
        //let block = BABYLON.MeshBuilder.CreateBox("box", {height: element.h, width: element.w, depth: element.d}, scene);
        let block = getMesh("tree");
        block.position.x = element.pX;
        block.position.z = element.pZ;
        block.position.y = element.h/2;
    });
}