var StateMachine = function(){
    var self = {
        activeState:'',
        previousState:'',
    }
    
    self.setState = function(state){
        previousState = activeState;
        activeState = state;
    }

    self.update = function(){
        activeState();
    }

    return self;
}

//EXPORTS
module.exports = StateMachine;