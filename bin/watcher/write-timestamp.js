/**
 * Basic script which writes a timestamp in file
 * This is executed by the "watch" script(s) after a change
 * has been detected in the file system.
 *
 * If the "web-dossier-loader" application is running in "development"
 * mode it will fetch the timestamp file, compare the timestamp with
 * the one stored in local storage and if the timestamp is newer
 * it will rebuild the wallet
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve([
    __dirname,
    path.sep,
    '..',
    path.sep,
    '..',
    path.sep
].join(path.sep));

const lastUpdateFile = [
    rootDir,
    'web-server',
    'secure-channels',
    'last-update.txt'
].join(path.sep);

fs.writeFileSync(lastUpdateFile, Date.now().toString());
