const path = require('path');
const {DateTime} = require('luxon');

const shell = require('./shell.js');
const {archiveDirectory} = require('./utils.js');


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
    console.log(`NEW REQUEST: ${packagesList}`);

    const newTarFolder = `npm_cache - ${zipName}.zip`;

    console.log('cleaning directory...');
    shell.rm('-rf', ['./node_modules', './npm_cache', newTarFolder]);

    console.log('downloading module...');
    shell.exec(`cross-env npm_config_cache=./npm_cache ./npm_node_modules/.bin/npm install --force --no-save ${packagesList}`);

    console.log('zipping...');
    await archiveDirectory('./npm_cache', newTarFolder);

    console.log('cleaning directory...');
    shell.rm('-rf', ['./node_modules', './npm_cache']);

    return path.resolve(process.cwd(), newTarFolder);
}

module.exports = {
    packPackages,
};
