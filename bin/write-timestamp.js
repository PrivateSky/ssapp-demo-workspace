const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(`${__dirname}${path.sep}..${path.sep}`);
const lastUpdateFile = [
    rootDir,
    'web-server',
    'secure-channels',
    'last-update.txt'
].join(path.sep);

fs.writeFileSync(lastUpdateFile, Date.now().toString());
