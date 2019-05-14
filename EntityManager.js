var EntityID = 1;
var Entity = function(id, x, z){
    var self = {
        id: id,
        position: {'x':x, 'z':z},
        radius: 0.5,
        lookingAt: 0,

        weapon: null,
        maxHP: 100,
        maxMana: 100,
        currentHP: 100,
        currentMana: 100,
        isPlayer: false,
        toRemove: false,
    }
    
    self.updatePosition = function(){
        self.position.x = self.circleBody.position[0];            
        self.position.z = self.circleBody.position[1];
    }

    Entity.list[id] = self;
    EntityID++;
    return self;
}

Entity.getUpdate = function() {
    let pack = [];
    for (let i in Entity.list) {
        let entity = Entity.list[i];
        entity.update();
        if (entity.toRemove) {
            entity.removeFromGame();
        }
        else {
            pack.push(entity.getUpdatePack());
        }
    }
    return pack;
}

Entity.getAllEntities = function() {
    let entities = [];
    for (let i in Entity.list)
        entities.push(Entity.list[i].getInitPack());
    return entities;
}

Entity.getFrameUpdateData = function(){
    let packs = {
        init:   Entity.initPack,
        remove: Entity.removePack,           
        update: Entity.getUpdate(),
    }
    Entity.emptyPacks();
    return packs;
}

Entity.emptyPacks = function() {
    Entity.initPack = [];
    Entity.removePack = [];
}

Entity.getID = function(){
    return EntityID;
}

Entity.list = {};
Entity.initPack = [];
Entity.removePack = [];

//EXPORTS
module.exports = Entity;