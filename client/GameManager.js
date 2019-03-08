class Entity {
    constructor(pack, scene){
        this.id = pack.id;
        this.lookingAt = pack.lookingAt;

        this.body = BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 1, depth: 1}, scene);
        this.body.position.x = pack.position.x;
        this.body.position.z = pack.position.z;
    }
}
Entity.list = {};

class Trigger {
    constructor(pack, scene){
        this.id = pack.id;
        this.lookingAt = pack.lookingAt;

        this.body = BABYLON.MeshBuilder.CreateBox("box", {height: .1, width: .1, depth: .1}, scene);
        this.body.position.x = pack.position.x;
        this.body.position.z = pack.position.z;
    }
}
Trigger.list = {};