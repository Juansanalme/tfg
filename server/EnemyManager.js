var BaseEnemy = function(){
    var self = {
        id:0,name:'base',model:'',
        playerDetectDistance: 15,
        roamMaxDistance: 10,
        followMaxDistance: 25,
        playerFollowDistance: 5,
        spawnDistance: 2,
        roamSpeed: 5,
        followSpeed: 6,
        returnSpeed: 7.5,
    }
    return self;
}

var Griffin = BaseEnemy();
Griffin.id = 1;
Griffin.model = "griffin";
Griffin.score = 1;

var Wolf = BaseEnemy();
Wolf.id = 2;
Wolf.model = "werwolf";
Wolf.score = 2;

var Skel = BaseEnemy();
Skel.id = 3;
Skel.model = "skel";
Skel.score = 2;

var Imp = BaseEnemy();
Imp.id = 4;
Imp.model = "imp";
Imp.score = 2;


//EXPORTS
BaseEnemy.list = {griffin:Griffin, wolf:Wolf, skel:Skel, imp:Imp};
module.exports = BaseEnemy.list;