var pdsFake = require("../../../../modules/signsensus/lib/InMemoryPDS");


var pds = pdsFake.newPDS();

var pset = require("../pds/utilityCreateSet").set;

var block = pds.computePTBlock(pset);

console.log(block); //4 transactions in input, only 2 in output