const chokidar = require('chokidar');
const childProcess = require('child_process');
const path = require('path');


const config = {
    run: null,
    watch: '.',
    allowedFileExtensions: ['.js'],
    args: '',
    exec: null,
    ignore: []
};

let forkedProcess;

const argv = process.argv.slice(2);


for (let i = 0; i < argv.length; ++i) {
    if (!argv[i].startsWith('--')) {
        throw new Error(`Invalid argument ${argv[i]}`);
    }

    const argument = argv[i].substr(2);

    const separatorIndex = argument.indexOf('=');

    if (separatorIndex !== -1) {
        const argumentKey = argument.substr(0, separatorIndex);
        const argumentValue = argument.substr(separatorIndex + 1);
        editConfig(argumentKey, preprocessArgument(argumentValue));
    } else {
        if (argv[i + 1].startsWith('--')) {
            throw new Error(`Missing value for argument ${argument}`);
        }

        editConfig(argument, preprocessArgument(argv[i + 1]));
        i += 1;
    }
}

config.watch = config.watch.split(',').map(watchPath => path.resolve(watchPath));

console.log('Watching paths ', config.watch.join(', '));

const watcher = chokidar.watch(config.watch, {
    ignored: ['**/.git/**'].concat(config.ignore.map(element => `**${element}**`)),
    ignoreInitial: true,
    usePolling: true
});

if (config.run) {
    runFile(config.run);
}

if (config.exec) {
    runExec();
}


watcher.on('change', restartServer);
watcher.on('add', restartServer);


/* ------------ Utils functions ------------ */

function editConfig(key, value) {
    if (!config.hasOwnProperty(key)) {
        throw new Error(`Invalid argument ${key}`);
    }

    config[key] = value;

    if (Array.isArray(config.key) && !Array.isArray(value)) {
        config[key] = [value];
    }
}

function preprocessArgument(argument) {
    let value = argument.split(',');

    if (value.length === 1) {
        value = value[0];
    } else {
        value = value.map(element => element.trim());
    }

    return value;
}

function restartServer(path) {
    let match = false;
    let allowedFileExtensions = config.allowedFileExtensions;

    for (let i = 0; i < allowedFileExtensions.length; ++i) {
        if (path.endsWith(allowedFileExtensions[i])) {
            match = true;
            break;
        }
    }

    if (!match) {
        return;
    }

    if (config.exec) {
        runExec();
    }

    if (config.run) {
        var fs = require("fs");
        console.log(`Some event triggered on file ${path}`, arguments, new String(fs.readFileSync(path)));
        runFile(config.run);
    } else {
        console.log(`Some event triggered on file ${path}`);
    }
}


function runFile(filePath) {
    if (forkedProcess) {
        forkedProcess.kill();
    }

    forkedProcess = childProcess.fork(filePath, config.args.split(' '))
}

function runExec() {
    childProcess.exec(config.exec, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
        }

        if (stdout) {
            console.log(stdout);
        }

        if (stderr) {
            console.error(stderr);
        }
    });

}