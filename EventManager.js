var triggerID = 0;
var Trigger = function(){
    var self = {
        id:'',
        position: {'x':0, 'z':0},
    }
    return self;
}

class Bullet {
    constructor(angle, x, z) {
        var self = Trigger();
        self.id = triggerID++;
        self.position.x = x;
        self.position.z = z;
        self.lookingAt = angle;
        self.speed = {'x':0,'z':0};
        self.speed.x = Math.cos(angle / 180 * Math.PI) * .5;
        self.speed.z = Math.sin(angle / 180 * Math.PI) * .5;
        self.timer = 0;
        self.toRemove = false;

        self.update = function () {
            if (self.timer++ > 60)
                self.toRemove = true;
            self.updatePosition();
        };
        self.updatePosition = function(){
            self.position.x += self.speed.x;
            self.position.z += self.speed.z;
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

    static getAllBullets() {
        let bullets = [];
        for (let i in Bullet.list)
            bullets.push(Bullet.list[i].getInitPack());
        return bullets;
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

    static getFrameUpdateData() {
        let packs = {
            init:   Bullet.initPack,
            remove: Bullet.removePack,           
            update: Bullet.getUpdate(),
        }
        Bullet.emptyPacks();
        return packs;
    }

    static emptyPacks() {
        Bullet.initPack = [];
        Bullet.removePack = [];
    }
}

Bullet.list = {};
Bullet.initPack = [];
Bullet.removePack = [];

module.exports = Bullet;