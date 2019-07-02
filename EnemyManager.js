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


//EXPORTS
BaseEnemy.list = {generic:Generic};
module.exports = BaseEnemy.list;