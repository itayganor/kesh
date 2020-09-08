const archiver = require('archiver');
const fs = require('fs-extra');

// thanks github issues
function archiveDirectory(src, dest, format = 'zip', {archiverOptions = {}, directoryData, directoryDestPath = false} = {}) {
    return new Promise((resolve, reject) => {
        const archive = archiver(format, archiverOptions);
        const output = fs.createWriteStream(dest);

        archive.pipe(output);
        archive.directory(src, directoryDestPath, directoryData);
        archive.finalize();

        output.on('close', () => resolve(archive));
        archive.on('error', (err) => reject(err));
    });
}

module.exports = {
    archiveDirectory,
};
