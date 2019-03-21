const p2 = require('p2');

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

_World.load = function (){

    // GROUNDS
    _World.map = map;

    // BLOCKS

    let mass, pX, pZ, h, d, w;
    mass = 0;
    w = map.groundWidth;
    d = map.groundHeight;
    h = 1;

    let y = map.mapMatrix.length - 1;
    for(let i in map.mapMatrix){
        for(let j in map.mapMatrix[i]){
            if(map.mapMatrix[i][j] == 4){
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

    console.log('World Loaded');
}

_World.distanceBetweenTwoPoints = function (initial, final){
    let distX = (final.x.toFixed(2) - initial.x.toFixed(2));
    let distZ = (final.z.toFixed(2) - initial.z.toFixed(2));
    return Math.sqrt(distX*distX + distZ*distZ).toFixed(2);
}

module.exports = _World;