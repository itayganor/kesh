const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const axios = require('axios');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const Logger = require('./logger.js');
const shell = require('./shell.js');
const {packPackages} = require('./download.js');
require('./sockets.js')(io);


app.use(bodyParser.json());
app.use(cors());

app.get('/api/download/:packages', async (req, res) => {
    let {packages} = req.params;
    let zipPath;
    try {
        packages = JSON.parse(packages);
        if (packages.length === 0) {
            throw new Error('no packages mentioned!');
        }
        zipPath = await packPackages(packages);
    } catch (e) {
        Logger.error(packages);
        return res.status(500).send(e.message);
    }

    res.download(zipPath, (err) => {
        if (err) {
            return Logger.error(err);
        }
        fs.remove(zipPath, err => err && Logger.error(err));
    });
});

app.get('/api/search', async (req, res) => {
    const {q} = req.query;
    if (!q) {
        return res.json([]);
    }

    const response = await axios.get('https://www.npmjs.com/search/suggestions?q=' + q);
    res.json(response.data.map(i => i.name));
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

app.use(express.static(path.resolve(process.cwd(), '../../../client')));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
