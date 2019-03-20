class Entity {
    constructor(pack, scene){
        this.id = pack.id;
        this.lookingAt = pack.lookingAt.toFixed(2);

        this.body = BABYLON.MeshBuilder.CreateBox("Sphere", {width:1, height:1}, scene);
        this.body.position.x = pack.position.x;
        this.body.position.z = pack.position.z;
        this.body.position.y = 0.5;
    }
}
Entity.list = {};
Entity.model;

class Trigger {
    constructor(pack, scene){

        if (!Trigger.spriteManBullet){
            Trigger.spriteManBullet = new BABYLON.SpriteManager("bullets", 
                                                                "./textures/dagger.png",
                                                                1000, 
                                                                {width: 32, height: 32}, 
                                                                scene);
        }

        this.id = pack.id;
        this.lookingAt = pack.lookingAt;

        this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManBullet);
        this.sprite.position.x = pack.position.x;
        this.sprite.position.z = pack.position.z;
        this.sprite.position.y = 1;
    }
}
Trigger.list = {};
Trigger.spriteManBullet;
