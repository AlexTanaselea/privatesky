



var ssutil = require("./ssutil");
var cutil = require("./cutil");


function Pulse(signer, currentPulseNumber, block, newTransactions, vsd){
    this.signer     = signer;
    this.cp         = currentPulseNumber;
    this.lset       = newTransactions; //digest -> transaction
    this.ptBlock    = block;      //array of digests
    this.vsd        = vsd;
}


function ConsensusManager(delgatedAgentName, communicationOutlet, pdsAdapter, pulsePeriodicity,  stakeHolders){

    var currentPulse = 0;
    var self = this;

    var lset = {}; // digest -> transaction
    var pset = {}; // digest -> transaction

    var ptBlock = [];

    var consensuses = [];

    var pulsesHistory = {};

    this.nodeName = delgatedAgentName;
    var  vsd = pdsAdapter.computeVSD();

    function pulse(){

        var majoritatianVSD = cutil.detectMajoritarianVSD(currentPulse,  pulsesHistory, stakeHolders);
        if(majoritatianVSD == "none"){
            majoritatianVSD = vsd; // we are alone or the network is down ;)
        }

        if(vsd == majoritatianVSD){
            ptBlock = cutil.detectMajoritarianPTBlock(currentPulse, pulsesHistory, stakeHolders);

            pdsAdapter.commit(cutil.makeSetFromBlock(pset, ptBlock));   //step 1
            cutil.setsRemoveArray(pset, ptBlock); //cleanings
        } else {
            // the node is badly out-of-sync
            //TODO: resync with the majoritarian nodes
            throw new Error("Sync not implemented yet");
        }

        var nextBlockSet = cutil.detectNextBlockSet(currentPulse,
                     pulsesHistory, stakeHolders, pset);                //step 2


        ptBlock         = pdsAdapter.approveBlock(nextBlockSet);        //step 3

        vsd             = pdsAdapter.computeVSD();                      //step 4

        var newPulse    = new Pulse(this.nodeName, currentPulse, ptBlock, lset, vsd);

        communicationOutlet.broadcastPulse(self.nodeName, newPulse);    //step 5
        this.recordPulse(self.nodeName, newPulse);                      //step 6 (it also moving lset in pset)
        //pset          = cutil.setsConcat(pset, lset);
        lset            = [];                                           //step 7
        currentPulse++;                                                 //step 8
        setTimeout(pulse, pulsePeriodicity);                            //step 9
    }

    pulse();// TODO: replace with a synchronization process

    this.dump = function(){
        console.log("Node:", delgatedAgentName, "Consensus history:", consensuses.join(" "));
    }

    this.createTransactionFromSwarm = function(swarm){
        var t = cutil.createTransaction(currentPulse, swarm);
        lset.push(t);
        return t;
    }

    this.recordPulse = function(from, pulse){

        pulse.blockDigest = ssutil.hashValues(pulse.ptBlock);
        if(!pulsesHistory[pulse.cp]){
            pulsesHistory[pulse.cp] = {};
        }
        pulsesHistory[pulse.cp][from] = pulse;

        //check for delayed pulses that should be ignored ( pulse.cp < CurrentPulse - 2)
        if(pulse.cp >= currentPulse - 2){
            for(var d in pulse.lset){
                pset[d] = pulse.lset[d];
            }
        }
        //TODO: ask for pulses that others received but we failed to receive
    }
}

exports.createConsensusManager = function(delegatedAgent, communicationOutlet, pulse, stakeHolders){
        return new ConsensusManager(delegatedAgent, communicationOutlet, pulse, stakeHolders);
}


