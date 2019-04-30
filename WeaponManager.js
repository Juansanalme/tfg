var Weapon = function(){
    var self = {
        id:0,name:0,damage:0,range:0,speed:0,cooldown:0,passiveSkill:0,activeSkill:0,sprite:0,
    }
    return self;
}

var Sword = Weapon();
Sword.id = 1;
Sword.name = 'sword';
Sword.damage = 10;
Sword.range = 17.5;
Sword.speed = 15;
Sword.cooldown = 250;
Sword.passiveSkill = null;
Sword.activeSkill = null;
Sword.sprite = './textures/32/sword.png';

var Lance = Weapon();
Lance.id = 2;
Lance.name = 'lance';
Lance.damage = 5;
Lance.range = 20;
Lance.speed = 17.5;
Lance.cooldown = 250;
Lance.passiveSkill = null;
Lance.activeSkill = null;
Lance.sprite = './textures/32/spear.png';

var Axe = Weapon();
Axe.id = 3;
Axe.name = 'axe';
Axe.damage = 15;
Axe.range = 15;
Axe.speed = 12.5;
Axe.cooldown = 375;
Axe.passiveSkill = null;
Axe.activeSkill = null;
Axe.sprite = './textures/32/axe.png';

var Bow = Weapon();
Bow.id = 4;
Bow.name = 'bow';
Bow.damage = 10;
Bow.range = 25;
Bow.speed = 17.5;
Bow.cooldown = 250;
Bow.passiveSkill = null;
Bow.activeSkill = null;
Bow.sprite = './textures/32/arrow.png';

var Dagger = Weapon();
Dagger.id = 5;
Dagger.name = 'dagger';
Dagger.damage = 7.5;
Dagger.range = 12.5;
Dagger.speed = 17.5;
Dagger.cooldown = 125;
Dagger.passiveSkill = null;
Dagger.activeSkill = null;
Dagger.sprite = './textures/32/dagger.png';

var Magic = Weapon();
Magic.id = 6;
Magic.name = 'magic';
Magic.damage = 20;
Magic.range = 17.5;
Magic.speed = 17.5;
Magic.cooldown = 250;
Magic.passiveSkill = null;
Magic.activeSkill = null;
Magic.sprite = './textures/32/iceshard.png';

//EXPORTS
Weapon.list = {sword:Sword, lance:Lance, axe:Axe, bow:Bow, dagger:Dagger, magic:Magic};
module.exports = Weapon.list;