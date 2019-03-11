const p2 = require('p2');

var _World = new p2.World({
    gravity:[0, 0]
});

_World.blocks = [];

const map = {
    groundHeight:8,
    groundWidth:8,
    mapMatrix:[
        [3,3,4,1,1,1,1,1,1,1,1,1,1],
        [3,3,4,1,1,1,1,1,1,1,1,1,1],
        [3,3,4,1,1,1,1,1,1,1,1,1,1],
        [3,4,4,1,1,1,1,1,1,1,1,1,2],
        [3,4,1,1,1,1,1,1,1,1,1,1,2],
        [3,3,1,1,1,1,1,1,1,1,1,2,2],
        [3,3,1,1,1,1,1,1,1,1,1,2,2],
        [3,3,1,1,1,1,1,1,1,1,2,2,0],
        [3,4,1,1,1,1,1,1,1,2,2,0,0],
        [3,4,4,1,1,1,1,1,1,2,0,0,0],
        [3,3,4,1,1,1,1,1,2,2,0,0,0],
        [3,3,4,1,1,1,2,2,0,0,0,0,0],
        [3,3,4,1,2,2,0,0,0,0,0,0,0],
    ],
}


_World.load = function (){

    // GROUNDS
    _World.map = map;

    // BLOCKS
    /*
    let mass, pX, pZ, h, d, w;
    mass = 0; pX = 0; pZ = 0; h = 1; d = 2; w = 7;
    // Create a body. Add a shape to the body. and add the body to the world.
    let staticBody = new p2.Body({mass:mass, position:[pX,pZ]});
//box
    let bodyShape = new p2.Box({height:d, width:w});
    staticBody.addShape(bodyShape);
    _World.addBody(staticBody);
//textures
    _World.blocks.push({'pX':pX, 'pZ':pZ, 'h':h ,'d':d, 'w':w});
    */
    // ENEMIES

    console.log('World Loaded');
}

module.exports = _World;