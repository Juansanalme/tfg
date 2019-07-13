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

var Generic = BaseEnemy();
Generic.id = 1;
Generic.model = "griffin";


var Wolf = BaseEnemy();
Wolf.id = 2;
Wolf.model = "werwolf";


//EXPORTS
BaseEnemy.list = {generic:Generic, wolf:Wolf};
module.exports = BaseEnemy.list;