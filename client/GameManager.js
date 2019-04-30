class Entity {
    constructor(pack, scene){
        this.id = pack.id;
        this.lookingAt = pack.lookingAt;

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

        switch (pack.sprite){
            case './textures/32/sword.png':
                if (!Trigger.spriteManSword){
                    Trigger.spriteManSword = new BABYLON.SpriteManager("bullets", pack.sprite, 1000, {width: 32, height: 32}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManSword);
                break;
            case './textures/32/spear.png':
                if (!Trigger.spriteManLance){
                    Trigger.spriteManLance = new BABYLON.SpriteManager("bullets", pack.sprite, 1000, {width: 32, height: 32}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManLance);
                break;
            case './textures/32/axe.png':
                if (!Trigger.spriteManAxe){
                    Trigger.spriteManAxe = new BABYLON.SpriteManager("bullets", pack.sprite, 1000, {width: 32, height: 32}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManAxe);
                break;
            case './textures/32/arrow.png':
                if (!Trigger.spriteManBow){
                    Trigger.spriteManBow = new BABYLON.SpriteManager("bullets", pack.sprite, 1000, {width: 32, height: 32}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManBow);
                break;
            case './textures/32/dagger.png':
                if (!Trigger.spriteManDagger){
                    Trigger.spriteManDagger = new BABYLON.SpriteManager("bullets", pack.sprite, 1000, {width: 32, height: 32}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManDagger);
                break;
            case './textures/32/iceshard.png':
                if (!Trigger.spriteManMagic){
                    Trigger.spriteManMagic = new BABYLON.SpriteManager("bullets", pack.sprite, 1000, {width: 32, height: 32}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManMagic);
                break;
        }

        this.id = pack.id;
        this.lookingAt = pack.lookingAt;
        
        this.sprite.size = 2;
        this.sprite.position.x = pack.position.x;
        this.sprite.position.z = pack.position.z;
        this.sprite.position.y = 1;
    }
}
Trigger.list = {};

Trigger.spriteManSword;
Trigger.spriteManLance;
Trigger.spriteManAxe;
Trigger.spriteManBow;
Trigger.spriteManDagger;
Trigger.spriteManMagic;