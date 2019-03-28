var EntityID = 1;
var Entity = function(id, x, z){
    var self = {
        id: id,
        position: {'x':x, 'z':z},
        radius: 0.5,
        lookingAt: 0,

        maxHP: 100,
        currentHP: 100,
        isPlayer: false,
    }
    EntityID++;
    return self;
}
Entity.getID = function(){
    return EntityID;
}


//EXPORTS
module.exports = Entity;