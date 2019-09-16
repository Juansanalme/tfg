
var wizard, griffin, werwolf, tree, rock, deadtree, grass1, grass2;
var spriteManSword, spriteManLance, spriteManAxe, spriteManArrow, spriteManDagger, spriteManMagic, spriteManBow, spriteManStaff, spriteManHealitem, spriteManManaitem, spriteHealpotion, spriteManManapotion;

function loadMeshes(assetsManager){
    let wizardMT = assetsManager.addMeshTask("","","./models/","wizard.babylon");
    wizardMT.onSuccess = function (task) {
        wizard = wizardMT.loadedMeshes[0];
        wizard.isVisible = false;
    }
    let griffinMT = assetsManager.addMeshTask("","","./models/","griffin_f.babylon");
    griffinMT.onSuccess = function (task) {
        griffin = griffinMT.loadedMeshes[0];
        griffin.isVisible = false;
    }
    let wolfMT = assetsManager.addMeshTask("","","./models/","werwolf.babylon");
    wolfMT.onSuccess = function (task) {
        werwolf = wolfMT.loadedMeshes[0];
        werwolf.isVisible = false;
    }
    let tree1MT = assetsManager.addMeshTask("","","./models/","tree.babylon");
    tree1MT.onSuccess = function (task) {
        tree = tree1MT.loadedMeshes[0];
        tree.isVisible = false;
    }
    let tree2MT = assetsManager.addMeshTask("","","./models/","deadtree.babylon");
    tree2MT.onSuccess = function (task) {
        deadtree = tree2MT.loadedMeshes[0];
        deadtree.isVisible = false;
    }
    let rockMT = assetsManager.addMeshTask("","","./models/","stone01.babylon");
    rockMT.onSuccess = function (task) {
        rock = rockMT.loadedMeshes[0];
        rock.isVisible = false;
    }
    let grass1MT = assetsManager.addMeshTask("","","./models/","grass1.babylon");
    grass1MT.onSuccess = function (task) {
        grass1 = grass1MT.loadedMeshes[0];
        grass1.isVisible = false;
    }
    let grass2MT = assetsManager.addMeshTask("","","./models/","grass2.babylon");
    grass2MT.onSuccess = function (task) {
        grass2 = grass2MT.loadedMeshes[0];
        grass2.isVisible = false;
    }
}

function getMesh(name){
    switch (name){
        case "wizard": return wizard.createInstance();
        case "griffin": return griffin.createInstance();
        case "werwolf": return werwolf.createInstance();
        case "tree1": return tree.createInstance();
        case "tree2": return deadtree.createInstance();
        case "rock": return rock.createInstance();
        case "grass1": return grass1.createInstance();
        case "grass2": return grass2.createInstance();
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
        var block;
 
        switch (element.id) {
            case 3:
                block = getMesh("tree1");
                break;
            case 4:
                block = getMesh("tree2");
                break;
            case 5:
                block = getMesh("rock");
                break;
            case 6:
                block = getMesh("grass1");
                break;
            case 7:
                block = getMesh("grass2");
                break;
        }
        block.position.x = element.pX;
        block.position.z = element.pZ;
        block.position.y = element.h/2;
    });
}

function loadQuadrant(w, h){
    //let img1 = new Image();
    
   // img1.onload = function(){
       // let img2 = new Image();
        //img2.onload = function(){
            let ground = BABYLON.MeshBuilder.CreateGround("", {height:h * 128 , width:w * 128}, scene);
            let mat = new BABYLON.StandardMaterial("", scene);
            let tex = new BABYLON.Texture("./textures/sinnombre.png", scene);
            mat.diffuseTexture = mat.specularTexture = mat.emissiveTexture = mat.ambientTexture = tex;
            ground.material = mat;

            ground.position.x = 128;
            ground.position.z = 128;  

/*
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

*/


       // }
    //    img2.src = './textures/q2.png';      
   // }
   // img1.src = './textures/q1.png';      
}