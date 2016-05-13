
/*
    Prepare the state of a swarm to be serialised
*/

exports.asJSON = function(valueObject, phaseName, args, callback){
    __swarmGlobals.uidGenerator.wait_for_condition(function(tryNumber){
        return valueObject.meta.swarmId;
    }, 1024, function(){
        var res = {};
        res.publicVars      = valueObject.publicVars;
        res.privateVars     = valueObject.privateVars;
        res.meta            = {};

        res.meta.swarmTypeName  = valueObject.meta.swarmTypeName;

        res.meta.swarmId    = valueObject.meta.swarmId;
        //res.meta.phaseId    = valueObject.meta.phaseId;
        res.meta.phaseName  = phaseName;

        res.meta.args       = args;
        res.meta.command    = "executeSwarmPhase";

        res.meta.waitStack  = valueObject.meta.waitStack; //TODO: think if is not better to be deep cloned and not referenced!!!

        return callback(null, res);
    })
}

exports.jsonToNative = function(serialisedValues, result){

    for(var v in serialisedValues.publicVars){
        result.publicVars[v] = serialisedValues.publicVars[v];

    };
    for(var v in serialisedValues.privateVars){
        result.privateVars[v] = serialisedValues.privateVars[v];
    };

    for(var v in serialisedValues.meta){
        result.meta[v] = serialisedValues.meta[v];
    };

}