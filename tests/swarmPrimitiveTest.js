
var flow = require("../lib/index.js");
var f = flow.createSwarm("simpleSwarm", {
    private:{
        a1:"int",
        a2:"int"
    },
    public:{
        result:"int"
    },
    begin:function(a1,a2){
        this.a1 = a1;
        this.a2 = a2;
        this.continue("agent", "doStep", 3, this.afterExecution);
    },
    doStep:function(a){
        this.result = this.a1 + this.a2 + a;
        //this.asyncReturn(null, this.result);
    },
    afterExecution: function(err, res){
        console.log("Execution after switching contexts...");
    }
});


f.begin(1,2 );
setTimeout(function(){
    console.log(`${f.result} should be 6`);
}, 2);
