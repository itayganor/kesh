const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');

const shell = require('./shell.js');
const {packPackages} = require('./download.js');


app.use(bodyParser.json());
app.use(cors());

app.get('/api/download/:packages', async (req, res) => {
    let {packages} = req.params;
    try {
        packages = JSON.parse(packages);
    } catch (e) {
        console.log(packages);
        return res.status(500).send(e.message);
    }

    const zipPath = await packPackages(packages);

    res.download(zipPath, (err) => {
        if (err) {
            return console.error(err);
        }
        fs.remove(zipPath, err => err && console.error(err));
    });
});

shell.cd('./runner');
if (!shell.test('-d', 'npm_node_modules')) {
    console.log('installing npm...');
    shell.exec('npm init -y', {silent: true});
    shell.exec('npm install npm@4.6.1 --silent');
    shell.mv('node_modules', 'npm_node_modules');
} else {
    console.log('npm already exists, skipping installation');
}
console.log('Finished setup!');

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
