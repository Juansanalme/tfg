class Entity {
    constructor(pack){
        this.id = pack.id;
        this.position = pack.position;
        this.lookingAt = pack.lookingAt;
        this.imgSource = pack.imgSource;
    }
}
Entity.list = {};

class Trigger {
    constructor(pack){
        this.id = pack.id;
        this.position = pack.position;
        this.lookingAt = pack.lookingAt;
        this.imgSource = pack.imgSource;
    }
}
Trigger.list = {};