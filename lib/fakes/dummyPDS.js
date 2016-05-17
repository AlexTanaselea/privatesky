
var sd = require("../chore/swarmDescription");

function dummyVM(name){
    function solveSwarm(swarm){
        sd.revive_swarm(swarm);
    }

    __swarmGlobals.PSK_PubSub.subscribe(name, solveSwarm);
}



exports.system = new dummyVM("system");
exports.agent = new dummyVM("agent");