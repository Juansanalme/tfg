var StateMachine = function(){
    var self = {
        activeState:'',
        previousState:'',
    }
    
    self.setState = function(state){
        previousState = this.activeState;
        this.activeState = state;
    }

    self.update = function(){
        this.activeState();
    }

    return self;
}

//EXPORTS
module.exports = StateMachine;