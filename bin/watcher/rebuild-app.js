/**
 * Wrapper script for 'npm run build [app]'
 * This is executed by the "privatesky/bin/scripts/watcher.js" when
 * a change is detected in any of the top level wallets/SSapp(s)
 */
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const rootDir = path.resolve([
    __dirname,
    path.sep,
    '..',
    path.sep,
    '..',
    path.sep
].join(path.sep));

const writeTimestampScriptPath = [
    rootDir,
    'bin',
    'watcher',
    'write-timestamp.js'
].join(path.sep);

const argv = Object.assign([], process.argv);
argv.shift();
argv.shift();

if (!argv.length) {
    throw new Error("Missing application name. Usage: rebuild-app [application name]");
}

const appPath = [rootDir, argv[0]].join(path.sep);

if (!fs.existsSync(appPath)) {
    throw new Error(`Application "${argv[0]}" doesn't exist`);
}

const forkedProcess = childProcess.exec(`npm run build ${argv[0]}`, {
    cwd: rootDir
}, (err, stdout, stderr) => {
    if (err) {
        console.error(err);
    }

    if (stdout) {
        // After an application has been successfully rebuilt
        // call the "write-timestamp.js" script to write the
        // "last-update.txt" timetamp file
        const forkedProcess = childProcess.fork(writeTimestampScriptPath);
        forkedProcess.on('error', (err) => {
            console.error(err);
        })
        console.log(stdout)
    }

    if (stderr) {
        console.error(stderr);
    }
});

