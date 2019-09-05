
var wizard, griffin, werwolf, dragon, tree, winds;
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
    spriteManHealitem = new BABYLON.SpriteManager("", './textures/32/healitem.png', 1000, {width: 64, height: 64}, scene);
    spriteManManaitem = new BABYLON.SpriteManager("", './textures/32/manaitem.png', 1000, {width: 64, height: 64}, scene);
    spriteHealpotion = new BABYLON.SpriteManager("", './textures/32/healpotion.png', 1000, {width: 64, height: 64}, scene);
    spriteManManapotion = new BABYLON.SpriteManager("", './textures/32/manapotion.png', 1000, {width: 64, height: 64}, scene);
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

    loadQuadrant(width, height);
    worldBlocks.forEach(element => {
        //let block = BABYLON.MeshBuilder.CreateBox("", {height: element.h, width: element.w, depth: element.d}, scene);
        let block = getMesh("tree");
        block.position.x = element.pX;
        block.position.z = element.pZ;
        block.position.y = element.h/2;
    });
}

function loadQuadrant(w, h){
    let img1 = new Image();
    
    img1.onload = function(){
        let img2 = new Image();
        img2.onload = function(){



            for(let i = 1; i < 5; i++){
                let ground = BABYLON.MeshBuilder.CreateGround("", {height:h * 50 , width:w * 50}, scene);
                let mat = new BABYLON.StandardMaterial("", scene);
                let tex = new BABYLON.Texture("./textures/q" + i + ".png", scene);
                mat.diffuseTexture = mat.specularTexture = mat.emissiveTexture = mat.ambientTexture = tex;
                ground.material = mat;
        
                switch (i) {
                    case 1:
                        ground.position.x = 25*2;
                        ground.position.z = 75*2;         
                        break;
                    case 2:
                        ground.position.x = 25*2;
                        ground.position.z = 25*2; 
                        break;
                    case 3:
                        ground.position.x = 75*2;
                        ground.position.z = 75*2; 
                        break;
                    case 4:
                        ground.position.x = 75*2;
                        ground.position.z = 25*2; 
                        break;
                }
            }




        }
        img2.src = './textures/q2.png';      
    }
    img1.src = './textures/q1.png';      
}