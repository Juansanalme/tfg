class Entity {
    constructor(pack, scene){
        this.id = pack.id;
        this.lookingAt = pack.lookingAt;

        this.body = BABYLON.MeshBuilder.CreateBox("Sphere", {width:1, height:1}, scene);
        this.body.position.x = pack.position.x;
        this.body.position.z = pack.position.z;
        this.body.position.y = 0.5;
        this.model = pack.model;

        if(pack.hp){
            this.maxHp = pack.hp;
            this.currentHp = pack.hp;
        }
    }
}
Entity.list = {};
Entity.model;

class Trigger {
    constructor(pack, scene){

        switch (pack.sprite){
            case 'sword':
                if (!Trigger.spriteManSword){
                    Trigger.spriteManSword = new BABYLON.SpriteManager("bullets", './textures/64/sword.png', 1000, {width: 64, height: 64}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManSword);
                break;
            case 'lance':
                if (!Trigger.spriteManLance){
                    Trigger.spriteManLance = new BABYLON.SpriteManager("bullets", './textures/64/spear.png', 1000, {width: 64, height: 64}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManLance);
                break;
            case 'axe':
                if (!Trigger.spriteManAxe){
                    Trigger.spriteManAxe = new BABYLON.SpriteManager("bullets", './textures/64/axe.png', 1000, {width: 64, height: 64}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManAxe);
                break;
            case 'arrow':
                if (!Trigger.spriteManArrow){
                    Trigger.spriteManArrow = new BABYLON.SpriteManager("bullets", './textures/64/arrow.png', 1000, {width: 64, height: 64}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManArrow);
                break;
            case 'dagger':
                if (!Trigger.spriteManDagger){
                    Trigger.spriteManDagger = new BABYLON.SpriteManager("bullets", './textures/64/dagger.png', 1000, {width: 64, height: 64}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManDagger);
                break;
            case 'iceshard':
                if (!Trigger.spriteManMagic){
                    Trigger.spriteManMagic = new BABYLON.SpriteManager("bullets", './textures/64/iceshard.png', 1000, {width: 64, height: 64}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManMagic);
                break;
            case 'bow':
                if (!Trigger.spriteManBow){
                    Trigger.spriteManBow = new BABYLON.SpriteManager("bullets", './textures/64/bow.png', 1000, {width: 64, height: 64}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManBow);
                break;
            case 'staff':
                if (!Trigger.spriteManStaff){
                    Trigger.spriteManStaff = new BABYLON.SpriteManager("bullets", './textures/64/staff.png', 1000, {width: 64, height: 64}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManStaff);
                break;

                case 'healitem':
                if (!Trigger.spriteManHealitem){
                    Trigger.spriteManHealitem = new BABYLON.SpriteManager("bullets", './textures/32/healitem.png', 1000, {width: 32, height: 32}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManHealitem);
                break;
                case 'manaitem':
                if (!Trigger.spriteManManaitem){
                    Trigger.spriteManManaitem = new BABYLON.SpriteManager("bullets", './textures/32/manaitem.png', 1000, {width: 32, height: 32}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManManaitem);
                break;
                case 'healpotion':
                if (!Trigger.spriteHealpotion){
                    Trigger.spriteHealpotion = new BABYLON.SpriteManager("bullets", './textures/32/healpotion.png', 1000, {width: 32, height: 32}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteHealpotion);
                break;
                case 'manapotion':
                if (!Trigger.spriteManManapotion){
                    Trigger.spriteManManapotion = new BABYLON.SpriteManager("bullets", './textures/32/manapotion.png', 1000, {width: 32, height: 32}, scene);}
                this.sprite = new BABYLON.Sprite("bullet", Trigger.spriteManManapotion);
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
/*
Trigger.spriteManSword;
Trigger.spriteManLance;
Trigger.spriteManAxe;
Trigger.spriteManBow;
Trigger.spriteManDagger;
Trigger.spriteManMagic;
Trigger.spriteManBow;
Trigger.spriteManStaff;

Trigger.spriteManHealitem;
Trigger.spriteManManaitem;
Trigger.spriteManHealpotion;
Trigger.spriteManManapotion;
*/