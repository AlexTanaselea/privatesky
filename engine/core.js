/*
Initial License: (c) Axiologic Research & Alboaie Sînică.
Contributors: Axiologic Research , PrivateSky project
Code License: LGPL or MIT.
*/

function safeErrorHandlingImplementation(err, res){
    if(err) throw err;
    return res;
}

$$ = {
    errorHandler: {
        error:function(err, args, msg){
            console.log(err, "Unknown error from function call with arguments:", args, "Message:", msg);
        },
        syntaxError:function(property, swarm){
            //throw new Error("Misspelled member name or other internal error!");
            var swarmName;
            try{
                if(typeof swarm == "string"){
                    swarmName = swarm;
                } else
                if(swarm && swarm.meta){
                    swarmName  = swarm.meta.swarmTypeName;
                } else {
                    swarmName = swarm.getInnerValue().meta.swarmTypeName;
                }
            } catch(err){
                swarmName = err.toString();
            }
            if(property){
                console.log("Unknown member ", property,  " in swarm ", swarmName);
            } else {
                console.log("Unknown swarm", swarmName);
            }

        },
        warning:function(msg){
            console.log(msg);
        }
    },
    securityContext:"system",
    uidGenerator: require("./choreographies/safe-uuid.js"),
    safeErrorHandling:function(callback){
        if(callback){
            return callback;
        } else{
            return safeErrorHandlingImplementation;
        }
    },
    libraryPrefix:"global",
    libraries: {
        global:{

        }
    },
    __intern:{
        mkArgs:function(args,pos){
            var argsArray = [];
            for(var i = pos; i < args.length; i++){
                argsArray.push(args[i]);
            }
            return argsArray;
        }
    }
};

$$.registerSwarmDescription =  function(libraryName,shortName, description){
    $$.libraries[libraryName][shortName] = description;
}


var swarmDescr = require("./choreographies/swarmDescription");


$$.callflows        = swarmDescr.createSwarmEngine("callflow");
$$.callflow         = $$.callflows;
$$.swarms           = swarmDescr.createSwarmEngine("swarm");
$$.swarm            = $$.swarms;
$$.contracts        = swarmDescr.createSwarmEngine("contract");
$$.contract         = $$.contracts;

$$.loadLibrary      = require("./util/loadLibrary").loadLibrary;

exports.enableTesting = function() {
    //$$.PSK_PubSub = require("./pubSub/InternalPubSub").internalBus;
    $$.PSK_PubSub = require("./pubSub/core/soundPubSub").soundPubSub;  //for testing
    var vms = require("./fakes/dummyVM");
    return exports;
}

$$.requireCoreModule = function(relativePath){
    var path = require("path");
    var absolutePath = path.resolve( __dirname + "/" + relativePath);
    return require(absolutePath);
}