const p2 = require('p2');
const Map = require('./WorldMap.js');
const EnemySpawner = require('./EnemySpawner');
const EnemyType = require('./EnemyManager');
const Weapon = require('./WeaponManager');
const WeaponDrop = require('./Trigger_WeaponDrop');
const PotionDrop = require('./Trigger_PotionDrop');

var _World = new p2.World({
    gravity:[0, 0]
});

_World.blocks = [];
var map = Map;
const blocks = {
    shape:'',
    height:'',
    width:'',
    posX:'',
    posZ:'',
}
_World.map = map;

const enemySpawners = [
    {x:50,z:50,type:'generic',weapon:'sword'},
    
    {x:150,z:50,type:'generic',weapon:'lance'},
    
    {x:75,z:75,type:'wolf',weapon:'axe'},
    {x:125,z:75,type:'wolf',weapon:'bow'},
    
    {x:50,z:150,type:'generic',weapon:'dagger'},
    {x:150,z:150,type:'generic',weapon:'sword'},
]

_World.load = function (){

    // GROUNDS
    console.log('Generating terrain...');

    // BLOCKS
    let mass, pX, pZ, h, d, w;
    mass = 0;
    w = map.groundWidth;//block width
    d = map.groundHeight;//block depth/2d height
    h = 1;//3d model height

    let y = map.blocks.length - 1;
    for(let i in map.blocks){
        for(let j in map.blocks[i]){
            if(map.blocks[i][j] == 3){
                //Blocks
                pX = j * d + d/2;
                pZ = y * w  + w/2;

                // Create a body. Add a shape to the body. and add the body to the world.
                let staticBody = new p2.Body({mass:mass, position:[pX,pZ]});
                let bodyShape = new p2.Box({height:d, width:w});
                staticBody.addShape(bodyShape);
                _World.addBody(staticBody);
                _World.blocks.push({'pX':pX, 'pZ':pZ, 'h':h ,'d':d, 'w':w});
            }
        }
        y--;
    }

    // ENEMIES
    console.log('Generating enemy nests...');
    enemySpawners.forEach(spawn => {
        let type = EnemyType[spawn.type];
        let weapon = Weapon[spawn.weapon];
        new EnemySpawner(spawn.x, spawn.z, type, weapon, _World);
    });

    console.log('World Loaded');
}

_World.distanceBetweenTwoPoints = function (initial, final){
    let distX = (final.x.toFixed(2) - initial.x.toFixed(2));
    let distZ = (final.z.toFixed(2) - initial.z.toFixed(2));
    return Math.sqrt(distX*distX + distZ*distZ).toFixed(2);
}

_World.angleBetweenTwoPoints = function (point1, point2){
    let horizDistance = Math.floor(point1.x - point2.x);
    let vertDistance = Math.floor(point1.z - point2.z);
    let angleRad = Math.atan2(vertDistance, horizDistance);
    let angle = angleRad * 180 / Math.PI;
    if(angle < 0){
        angle += 360;
    }
    return angle;
}

_World.createLoot = function (x, z){

    let randomLoot = Math.floor(Math.random() * 10) + 1;
    let droppedItem;

    if (randomLoot > 0 && randomLoot < 7){
        switch (randomLoot){
            case 1: droppedItem = Weapon.sword; break;
            case 2: droppedItem = Weapon.lance; break;
            case 3: droppedItem = Weapon.axe; break;
            case 4: droppedItem = Weapon.bow; break;
            case 5: droppedItem = Weapon.dagger; break;
            case 6: droppedItem = Weapon.magic; break;
        }   
        new WeaponDrop(x, z, droppedItem, _World);
    }else{
        switch (randomLoot){
            case 7: droppedItem = 1; break;
            case 8: droppedItem = 2; break;
            case 9: droppedItem = 3; break;
            case 10: droppedItem = 4; break;
        }
        new PotionDrop(x, z, droppedItem, _World);
    }

}

module.exports = _World;