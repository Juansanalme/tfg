const baseDamage = 10;
const baseRange = 17.5;
const baseSpeed = 20;
const baseCooldown = 300;

var Weapon = function(){
    var self = {
        id:0,name:'base',damage:10,range:20,speed:20,cooldown:250,passiveSkill:0,activeSkill:0,sprite:0,score:0,
    }
    return self;
}

var Sword = Weapon();
Sword.id = 1;
Sword.name = 'sword';
Sword.dropName = 'sword';
Sword.damage = baseDamage;
Sword.range = baseRange;
Sword.speed = baseSpeed;
Sword.cooldown = baseCooldown;
Sword.passiveSkill = null;
Sword.activeSkill = function(bullet, player, world){
    new bullet(player.lookingAt, player.position.x, player.position.z, false, player.weapon, player.attackDamage, world);
    new bullet(player.lookingAt - 30, player.position.x, player.position.z, false, player.weapon, player.attackDamage, world);
    new bullet(player.lookingAt - 330, player.position.x, player.position.z, false, player.weapon, player.attackDamage, world);
};
Sword.score = 1;

var Lance = Weapon();
Lance.id = 2;
Lance.name = 'lance';
Lance.dropName = 'lance';
Lance.damage = 5;
Lance.range = 20;
Lance.speed = 17.5;
Lance.cooldown = 250;
Lance.passiveSkill = null;
Lance.activeSkill = function(bullet, player, world){
    player.movSpeed = player.movSpeed * 2;
    let speedInterval = setInterval(() => {
        player.movSpeed = 10;
        clearInterval(speedInterval);
    }, 1000 * 5);
};
Lance.score = 2;

var Axe = Weapon();
Axe.id = 3;
Axe.name = 'axe';
Axe.dropName = 'axe';
Axe.damage = 15;
Axe.range = 15;
Axe.speed = 12.5;
Axe.cooldown = 375;
Axe.passiveSkill = null;
Axe.activeSkill  = function(bullet, player, world){
    for(let i = 0; i < 360; i += 60)
        new bullet(i, player.position.x, player.position.z, false, player.weapon, player.attackDamage, world);
};Axe.score = 2;

var Bow = Weapon();
Bow.id = 4;
Bow.name = 'arrow';
Bow.dropName = 'bow';
Bow.damage = 10;
Bow.range = 25;
Bow.speed = 17.5;
Bow.cooldown = 250;
Bow.passiveSkill = null;
Bow.activeSkill  = function(bullet, player, world){
    for(let i = 0; i < 360; i += 30)
        new bullet(i, player.position.x, player.position.z, false, player.weapon, player.attackDamage, world);
};Bow.score = 2;

var Dagger = Weapon();
Dagger.id = 5;
Dagger.name = 'dagger';
Dagger.dropName = 'dagger';
Dagger.damage = 7.5;
Dagger.range = 12.5;
Dagger.speed = 17.5;
Dagger.cooldown = 125;
Dagger.passiveSkill = null;
Dagger.activeSkill = function(bullet, player, world){
    for(let i = 0; i < 360; i += 30)
        new bullet(i, player.position.x, player.position.z, false, player.weapon, player.attackDamage, world);
};
Dagger.score = 3;

var Magic = Weapon();
Magic.id = 6;
Magic.name = 'iceshard';
Magic.dropName = 'staff';
Magic.damage = 20;
Magic.range = 17.5;
Magic.speed = 17.5;
Magic.cooldown = 250;
Magic.passiveSkill = null;
Magic.activeSkill = function(bullet, player, world){
    for(let i = 0; i < 360; i += 30)
        new bullet(i, player.position.x, player.position.z, false, player.weapon, player.attackDamage, world);
};Magic.score = 3;

//EXPORTS
Weapon.list = {sword:Sword, lance:Lance, axe:Axe, bow:Bow, dagger:Dagger, magic:Magic};
module.exports = Weapon.list;