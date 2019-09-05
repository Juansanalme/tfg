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
Generic.score = 1;

var Wolf = BaseEnemy();
Wolf.id = 2;
Wolf.model = "werwolf";
Wolf.score = 2;

var WindS = BaseEnemy();
WindS.id = 3;
WindS.model = "Wind_Serpent";
WindS.score = 3;


//EXPORTS
BaseEnemy.list = {generic:Generic, wolf:Wolf, winds:WindS};
module.exports = BaseEnemy.list;