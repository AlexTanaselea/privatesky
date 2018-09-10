const config = {
    endpoint:'http://127.0.0.1',
    port: 8080,
    channelId: 'localdomainchannel',
    spaceName: 'localhost'
};


require('../engine/core');
require('../modules/psk-http-client/index');
const path = require('path');

if(process.argv.length === 3) {
    config.spaceName = process.argv[2];
}


process.env.PRIVATESKY_TMP = path.resolve('../tmp');

$$.container = require('../modules/dicontainer').newContainer($$.errorHandler);
$$.PSK_PubSub = require('../engine/pubSub/launcherPubSub').create(path.resolve('../tmp'), path.resolve('..'));

$$.loadLibrary('testSwarms', '../libraries/testSwarms');

$$.remote.createRequestManager(1000);
$$.remote.newEndPoint('virtualmqEndpoint', `${config.endpoint}:${config.port}/${config.channelId}`, `${config.endpoint}:${config.port}/${config.channelId}`);


$$.remote.virtualmqEndpoint.on('*', '*', function (err, res) {
    $$.PSK_PubSub.subscribe($$.CONSTANTS.SWARM_RETURN, (swarm) => {
        // TODO: send swarm home
    }, () => false);
    $$.PSK_PubSub.publish($$.CONSTANTS.SWARM_FOR_EXECUTION, res);
});
