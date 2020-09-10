const path = require('path');
const {DateTime} = require('luxon');

const shell = require('./shell.js');
const {archiveDirectory} = require('./utils.js');
const Logger = require('./logger.js');


/**
 *
 * @param packages {array<string>}
 * @returns string
 */
async function packPackages(packages) {
    // find the first package without a / in its name
    let zipName = packages.find(pkg => !pkg.includes('/'));
    if (!zipName) {
        zipName = DateTime.local().toFormat('yyyy-MM-dd HH_mm_ss');
    }

    const packagesList = packages.join(' ');
    Logger.log(`NEW REQUEST: ${packagesList}`);

    const newTarFolder = `npm_cache - ${zipName}.zip`;

    Logger.log('cleaning directory...');
    directoryCleanup(newTarFolder);

    Logger.log('downloading module...');
    const [code, stdout, stderr] = await exec(`cross-env npm_config_cache=./npm_cache ./npm_node_modules/.bin/npm install --force --no-save --loglevel=error ${packagesList}`);
    // const {stdout, stderr} = child;
    if (stdout) {Logger.emitLog(stdout);}
    if (stderr) {Logger.emitError(stderr);}

    Logger.log('zipping...');
    await archiveDirectory('./npm_cache', newTarFolder);

    Logger.log('cleaning directory...');
    directoryCleanup();

    Logger.log('done!');
    return path.resolve(process.cwd(), newTarFolder);
}


function directoryCleanup(...rest) {
    shell.rm('-rf', ['./node_modules', './npm_cache', ...rest]);
}

module.exports = {
    packPackages,
    directoryCleanup,
};


function exec(command) {
    return new Promise(resolve => {
        shell.exec(command, {async: true}, (...args) => resolve(args));
    });
}
