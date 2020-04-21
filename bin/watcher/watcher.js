/**
 * Wrapper script for `privatesky/bin/scripts/watcher.js`.
 */
const path = require('path');
const childProcess = require('child_process');

const forkedProcesses = [];

//const rootDir = path.resolve(`${__dirname}${path.sep}..${path.sep}..${path.sep}`);
const rootDir = path.resolve([
    __dirname,
    path.sep,
    '..',
    path.sep,
    '..',
    path.sep
].join(path.sep));

const watcherScriptPath = [
    rootDir,
    'privatesky',
    'bin',
    'scripts',
    'watcher.js'
].join(path.sep);

const writeTimestampScriptPath = [
    rootDir,
    'bin',
    'watcher',
    'write-timestamp.js'
].join(path.sep);

const rebuildAppScriptPath = [
    rootDir,
    'bin',
    'watcher',
    'rebuild-app.js'
].join(path.sep);

const config = {
    files: '',
    app: ''
};

const argv = Object.assign([], process.argv);
argv.shift();
argv.shift();

for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) {
        throw new Error(`Invalid argument ${argv[i]}`);
    }

    const argument = argv[i].substr(2);
    const separatorIndex = argument.indexOf('=');

    let argumentKey;
    let argumentValue;

    if (separatorIndex !== -1) {
        argumentKey = argument.substr(0, separatorIndex);
        argumentValue = argument.substr(separatorIndex + 1);
    } else {
        if (argv[i + 1].startsWith('--')) {
            throw new Error(`Missing value for argument ${argument}`);
        }

        argumentKey = argument;
        argumentValue = argv[i + 1];
    }

    argumentValue = preprocessArgument(argumentValue);
    editConfig(argumentKey, argumentValue);
}

if (!config.files && !config.app) {
    process.exit(0);
}

if (config.files) {
    // Watch for changes in `web-server/secture-channels/` subfolders
    // and write a "last-update.txt" timestamp file
    config.files = !Array.isArray(config.files) ? [config.files] : config.files;
    const watchedPaths = config.files.filter(path => path.length)
        .map((dir) => {
            return path.resolve(`${rootDir}${path.sep}${dir}`);
        })
        .join(',');

    const forkedProcess = childProcess.fork(watcherScriptPath, [
        '--watch', watchedPaths,
        '--run', writeTimestampScriptPath,
        '--allowedFileExtensions=.js,.html,.css,.json'
    ]);
    forkedProcess.on('error', showProcessError);
    forkedProcesses.push(forkedProcess);
}


if (config.app) {
    // Watch for changes in the top-level wallets/ssapp(s)
    // and trigger wallet/ssapp rebuild
    config.app = !Array.isArray(config.app) ? [config.app] : config.app;
    const watchedApps = config.app.filter(path => path.length)
        .map((dir) => {
            return path.resolve(`${rootDir}${path.sep}${dir}`);
        });

    for (const appPath of watchedApps) {
        const appName = appPath.split(path.sep).pop();
        const forkedProcess = childProcess.fork(watcherScriptPath, ['--watch', appPath,
            '--run', rebuildAppScriptPath,
            '--args', appName,
            '--allowedFileExtensions=.js,.html,.css,.json',
            '--ignore', '/code/constitution,/code/scripts/bundles']);
        forkedProcess.on('error', showProcessError);
        forkedProcesses.push(forkedProcess);
    }
}

function showProcessError(err) {
    console.error(err);
}

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

