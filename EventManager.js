var triggerID = 0;
var Trigger = function(){
    var self = {
        id:'',
        position: {'x':0, 'y':0},
    }
    return self;
}

class Bullet {
    constructor(angle, x, y) {
        var self = Trigger();
        self.id = triggerID++;
        self.position.x = x;
        self.position.y = y;
        self.lookingAt = angle;
        self.speed = {'x':0,'y':0};
        self.speed.x = Math.cos(angle / 180 * Math.PI) * 10;
        self.speed.y = Math.sin(angle / 180 * Math.PI) * 10;
        self.timer = 0;
        self.toRemove = false;

        self.update = function () {
            if (self.timer++ > 60)
                self.toRemove = true;
            self.updatePosition();
        };
        self.updatePosition = function(){
            self.position.x += self.speed.x;
            self.position.y += self.speed.y;
        }
        self.getInitPack = function(){
            return{
                id: self.id,
                position: self.position,
                lookingAt: self.lookingAt,
            }
        }
        self.getUpdatePack = function(){
            return{
                id: self.id,
                position: self.position,
                lookingAt: self.lookingAt,
            }
        }
        Bullet.list[self.id] = self;
        Bullet.initPack.push(self.getInitPack());
        return self;
    }

    static emptyPacks() {
        Bullet.initPack = [];
        Bullet.removePack = [];
    } 
    static getInitPack() {
        return Bullet.initPack;
    }
    static getRemovePack() {
        return Bullet.removePack;
    }

    static getUpdate() {
        let pack = [];
        for (let i in Bullet.list) {
            let bullet = Bullet.list[i];
            bullet.update();
            if (bullet.toRemove) {
                delete Bullet.list[i];
                Bullet.removePack.push(bullet.id);
            }
            else {
                pack.push(bullet.getUpdatePack());
            }
        }
        return pack;
    }

    static getAllBullets() {
        let bullets = [];
        for (let i in Bullet.list)
            bullets.push(Bullet.list[i].getInitPack());
        return bullets;
    }
}

Bullet.list = {};
Bullet.initPack = [];
Bullet.removePack = [];

module.exports = Bullet;