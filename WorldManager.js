const p2 = require('p2');
const Entity = require('./EntityManager');
const Enemy = require('./Enemy');
const Weapon = require('./WeaponManager');
const WeaponDrop = require('./Trigger_WeaponDrop');

var _World = new p2.World({
    gravity:[0, 0]
});

_World.blocks = [];

const map = {
    groundHeight:4,
    groundWidth:4,
    mapMatrix:[
        [0,0,3,3,3,3,3,4,3,3,3,0,0],
        [0,3,3,1,1,1,1,1,1,4,1,3,0],
        [3,3,1,4,1,1,1,1,1,1,1,3,3],
        [3,1,1,1,1,1,1,1,1,1,1,1,3],
        [3,1,1,1,1,1,1,1,1,1,4,1,3],
        [3,1,1,1,1,1,1,1,1,1,1,2,3],
        [3,1,1,1,1,1,4,1,1,1,1,2,3],
        [3,1,4,1,1,4,4,1,1,1,2,2,3],
        [3,1,1,1,1,1,1,1,1,2,2,2,3],
        [3,3,1,1,1,1,1,1,1,4,2,2,3],
        [0,3,1,1,1,1,1,1,2,2,2,2,3],
        [0,3,3,4,4,1,2,2,2,2,2,3,3],
        [0,0,3,3,3,3,3,3,3,3,3,3,0],
    ],
}

const blocks = {
    shape:'',
    height:'',
    width:'',
    posX:'',
    posZ:'',
}

const enemies = [
    {x:0,z:0},
    
    {x:0,z:30},
    
    {x:00,z:10},
    {x:30,z:30},
    
    {x:30,z:0},
    {x:60,z:0},
]

_World.load = function (){

    // GROUNDS
    console.log('Creating ground');
    _World.map = map;

    // BLOCKS
    let mass, pX, pZ, h, d, w;
    mass = 0;
    w = map.groundWidth;//block width
    d = map.groundHeight;//block depth/2d height
    h = 1;//3d model height

    let y = map.mapMatrix.length - 1;
    for(let i in map.mapMatrix){
        for(let j in map.mapMatrix[i]){
            if(map.mapMatrix[i][j] == 4){
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
    console.log('Creating enemies');
    enemies.forEach(enemy => {
        let id = Entity.getID();
        new Enemy(id, enemy.x, enemy.z, Weapon.sword, _World);
    });

    console.log('World Loaded');
}

_World.distanceBetweenTwoPoints = function (initial, final){
    let distX = (final.x.toFixed(2) - initial.x.toFixed(2));
    let distZ = (final.z.toFixed(2) - initial.z.toFixed(2));
    return Math.sqrt(distX*distX + distZ*distZ).toFixed(2);
}

_World.angleBetweenTwoPoints = function (point1, point2){
    let angle = Math.toDegrees(Math.atan2(point2.y - point1.y, point2.x - point1.x));
    if(angle < 0){
        angle += 360;
    }
    return angle;
}

_World.createLoot = function (x, z){

    let randomWeapon = Math.floor(Math.random() * 6) + 1;
    let weapondrop;
    switch (randomWeapon){
        case 1: weapondrop = Weapon.sword; break;
        case 2: weapondrop = Weapon.lance; break;
        case 3: weapondrop = Weapon.axe; break;
        case 4: weapondrop = Weapon.bow; break;
        case 5: weapondrop = Weapon.dagger; break;
        case 6: weapondrop = Weapon.magic; break;
    }

    new WeaponDrop(x, z, weapondrop, _World);

}

module.exports = _World;