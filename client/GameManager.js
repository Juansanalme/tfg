class Entity {
    constructor(pack){
        this.id = pack.id;
        this.lookingAt = pack.lookingAt;

        this.body = getMesh(pack.model);
        this.body.isVisible = true;

        this.body.position.x = pack.position.x;
        this.body.position.z = pack.position.z;
        this.body.position.y = 0.5;

        if(pack.hp){
            this.currentHp = pack.hp;
            this.currentMana = pack.mana;
            this.hpPotions = 0;
            this.manaPotions = 0;
            this.score = 0;
            this.level = 1;
        }
    }
}
Entity.list = {};

class Trigger {
    constructor(pack){

        this.sprite = getSprite(pack.sprite);

        this.id = pack.id;
        this.lookingAt = pack.lookingAt;
        
        this.sprite.size = 2;
        this.sprite.position.x = pack.position.x;
        this.sprite.position.z = pack.position.z;
        this.sprite.position.y = 1;
    }
}
Trigger.list = {};