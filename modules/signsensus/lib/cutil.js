/*
consensus helper functions
*/

var ssutil = require("./ssutil");

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function Transaction(currentPulse, swarm){
    this.input      = swarm.input;
    this.output     = swarm.output;
    this.swarm      = swarm;
    var arr         = process.hrtime();
    this.second     = arr[0];
    this.nanosecod  = arr[1];
    this.CP         = currentPulse;
    this.digest     = ssutil.hashValues(this);
}


exports.createTransaction = function(currentPulse, swarm, input, output){
    return new Transaction(currentPulse, swarm, input, output);
}

exports.orderTransactions = function( pset){ //order in place the pset array
    pset.sort(function(t1, t2){
        if(t1.CP < t2.CP ) return -1;
        if(t1.CP > t2.CP ) return 1;
        if(t1.second < t2.second ) return -1;
        if(t1.second > t2.second ) return 1;
        if(t1.nanosecod < t2.nanosecod) return -1;
        if(t1.nanosecod > t2.nanosecod ) return 1;
        if(t1.digest < t2.digest ) return -1;
        if(t1.digest > t2.digest ) return 1;
        return 0; //only for identical transactions...
    })
    return pset;
}

function getMajorityField(obj, fieldName, extractFieldName, stakeHolders){
    var allFields = {};
    var majorityValue;
    for(var pulse in obj){
        var v = pulse[fieldName];
        if(allFields[v] ){
            allFields[v]++;
        } else {
            allFields[v] = 1;
        }
    }

    for(var i in allFields){
        if(allFields[i] >= math.floor(stakeHolders/2) + 1){
            majorityValue = allFields[i];
            if(fieldName == extractFieldName){
                return majorityValue;
            } else {
                for(var v in obj){
                    if(obj[fieldName] == majorityValue){
                        return obj[extractFieldName];
                    }
                }
            }
        }
    }
    return "none"; //there is no majority
}

exports.detectMajoritarianVSD = function (currentPulse, pulsesHistory, stakeHolders){
    var pulsesCPMinus1 = pulsesHistory[currentPulse - 1];
    if(!pulsesCPMinus1){
        return "none"; //for booting empty spaces
    }

    return getMaximCountField(pulsesCPMinus1, "vsd", "vsd", stakeHolders);
}

exports.detectMajoritarianPTBlock = function(currentPulse, pulsesHistory, stakeHolders){
    var pulsesCPMinus1 = pulsesHistory[currentPulse - 1];
    if(!pulsesCPMinus1){
        return []; //there is none...
    }
    var btBlock = getMajorityField(pulsesCPMinus1,"blockDigest", "ptBlock", stakeHolders);
    if(btBlock != "none"){
        return btBlock;
    }
    return [];
}


exports.makeSetFromBlock = function(knownTransactions, block){
    var result = {};
    block.forEach(i => result[i] = knownTransactions[i]);
    return result;
}

exports.detectNextBlockSet = function(currentPulse, ignoreNewerThen, pulsesHistory, stakeHolders, pset){
    var pulsesCPMinus1 = pulsesHistory[currentPulse - 1];
    if(!pulsesCPMinus1){
        return {}; //for booting empty spaces
    }

    var nextBlock = [];


    return exports.makeSetFromBlock(pset, nextBlock);
}



exports.setsConcat = function(target, from){
    for(var d in from){
        target[d] = from;
    }
    return target;
}


exports.setsRemoveArray = function(target, arr){
    arr.forEach(i => delete target[i]; );
    return target;
}