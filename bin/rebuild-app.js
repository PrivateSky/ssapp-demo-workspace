const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const rootDir = path.resolve(`${__dirname}${path.sep}..${path.sep}`);

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
        console.log(stdout)
    }

    if (stderr) {
        console.error(stderr);
    }
});

