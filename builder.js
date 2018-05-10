var config = {
    "workDir": ".",
    "dependencies": [
        {
            "name": "signsensus",
            "src": "https://github.com/PrivateSky/signsensus.git",
            "actions": [
                {
                    "type": "remove",
                    "target": "modules/signsensus"
                },
                {
                    "type": "clone",
                    "options": {
                        "depth": "1",
                        "branch": "master"
                    },
                    "target": "modules"
                }
            ]
        },
        {
            "name": "dicontainer",
            "src": "https://github.com/PrivateSky/dicontainer.git",
            "actions": [
                {
                    "type": "remove",
                    "target": "modules/dicontainer"
                },
                {
                    "type": "clone",
                    "options": {
                        "depth": "1",
                        "branch": "master"
                    },
                    "target": "modules"
                }
            ]
        },
        {
            "name": "pskcrypto",
            "src": "https://github.com/PrivateSky/pskcrypto.git",
            "actions": [
                {
                    "type": "remove",
                    "target": "modules/pskcrypto"
                },
                {
                    "type": "clone",
                    "options": {
                        "depth": "1",
                        "branch": "master"
                    },
                    "target": "modules"
                }
            ]
        },
        {
            "name": "double-check",
            "src": "https://github.com/PrivateSky/double-check.git",
            "actions": [
                {
                    "type": "remove",
                    "target": "modules/double-check"
                },
                {
                    "type": "clone",
                    "options": {
                        "depth": "1",
                        "branch": "master"
                    },
                    "target": "modules"
                }
            ]
        },
        {
            "name": "whys",
            "src": "https://github.com/PrivateSky/whys.git",
            "actions": [
                {
                    "type": "remove",
                    "target": "modules/whys"
                },
                {
                    "type": "clone",
                    "options": {
                        "depth": "1",
                        "branch": "master"
                    },
                    "target": "modules"
                }
            ]
        },
        {
            "name": "psk-integration-testing",
            "src": "https://github.com/PrivateSky/psk-integration-testing.git",
            "actions": [
                {
                    "type": "remove",
                    "target": "tests/psk-integration-testing"
                },
                {
                    "type": "clone",
                    "options": {
                        "depth": "1",
                        "branch": "master"
                    },
                    "target": "tests"
                }
            ]
        },
        {
            "name": "psk-smoke-testing",
            "src": "https://github.com/PrivateSky/psk-smoke-testing.git",
            "actions": [
                {
                    "type": "remove",
                    "target": "tests/psk-smoke-testing"
                },
                {
                    "type": "clone",
                    "options": {
                        "depth": "1",
                        "branch": "master"
                    },
                    "target": "tests"
                }
            ]
        },
        {
            "name": "psk-unit-testing",
            "src": "https://github.com/PrivateSky/psk-unit-testing.git",
            "actions": [
                {
                    "type": "remove",
                    "target": "tests/psk-unit-testing"
                },
                {
                    "type": "clone",
                    "options": {
                        "depth": "1",
                        "branch": "master"
                    },
                    "target": "tests"
                },
                {
                    "type": "move",
                    "src" : "tests/psk-unit-testing/core/testSwarms",
                    "target": "libraries/testSwarms",
                    "options": {
                        "overwrite" : true
                    }
                }
            ]
        },
        {
            "name": "combos",
            "src": "https://github.com/jfairbank/combos.git",
            "actions": [
                {
                    "type": "remove",
                    "target": "modules/combos"
                },
                {
                    "type": "clone",
                    "options": {
                        "depth": "1",
                        "branch": "master"
                    },
                    "target": "modules"
                },
                {
                    "type": "move",
                    "src" : "modules/combos/src",
                    "target": "modules/combos/lib",
                    "options": {
                        "overwrite" : true
                    }
                }
            ]
        }
    ]
}

require("./engine/core").enableTesting();
var deployer = $$.loadLibrary("deployer", "./libraries/deployer");

$$.callflow.start("deployer.Deployer").run(config, function (error, result) {
    if(error){
        console.log("[Deployer - Error]", error);
    }else{
        console.log("[Deployer - Result]", result);
    }
});
