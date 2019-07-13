var triggerID = 0;
var Trigger = function(x, z, world){
    var self = {
        id: triggerID,
        position: {'x':x, 'z':z},
        radius: 0.5,
        isBullet: false
    }

    self.update = function(){}
    self.removeFromGame = function(){}
    self.isTouching = function(entity){
        if(world.distanceBetweenTwoPoints(self.position, entity.position) <=
            self.radius + entity.radius){
            return true;
        }
        return false;
    };
    self.onTouch = function(entity){};

    triggerID++;
    return self;
}

Trigger.update = function(entities, blocks){
    for(let t in Trigger.list){
        //Triggers to entities
        let trigger = Trigger.list[t];
        for(let e in entities){
            let entity = entities[e];
            if(trigger.isTouching(entity)){
                trigger.onTouch(entity);
            }
        };
        //Bullets to blocks
        if(trigger.isBullet){
            blocks.forEach(block => {
                if(trigger.isTouchingBlock(block)){
                    trigger.onTouchBlock();
                }           
            });
        }
    };

}

Trigger.getUpdate = function(){
    let pack = [];
    for (let i in Trigger.list) {
        let trigger = Trigger.list[i];
        trigger.update();
        if (trigger.toRemove) {
            trigger.removeFromGame();
        }
        else {
            pack.push(trigger.getUpdatePack());
        }
    }
    return pack;
}

Trigger.getFrameUpdateData = function(){
    let packs = {
        init:   Trigger.initPack,
        remove: Trigger.removePack,           
        update: Trigger.getUpdate(),
    }
    Trigger.emptyPacks();
    return packs;
}

Trigger.emptyPacks = function(){
    Trigger.initPack = [];
    Trigger.removePack = [];
}

Trigger.getAllTriggers = function() {
    let triggers = [];
    for (let i in Trigger.list)
        triggers.push(Trigger.list[i].getInitPack());
    return triggers;
}

Trigger.list = {};
Trigger.initPack = [];
Trigger.removePack = [];

//EXPORTS
module.exports = Trigger;