const _PlayerDetectDistance = 15,
      _RoamMaxDistance = 10,
      _FollowMaxDistance = 25,
      _PlayerFollowDistance = 5,
      _SpawnDistance = 2,
      _roamSpeed = 5,
      _followSpeed = 6,
      _returnSpeed = 7.5;

var BaseEnemy = function(){
    var self = {
        id:0,name:'base',damage:10,range:20,speed:20,sprite:0,
    }
    return self;
}

var Generic = BaseEnemy();
Generic.id = 0;


//EXPORTS
BaseEnemy.list = {generic:Generic};
module.exports = BaseEnemy.list;