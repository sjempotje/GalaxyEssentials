const express = require("express");
const { PORT } = require("./config.js");
const fs = require("fs").promises;
const path = require('path');
const dirPath = path.join(__dirname, '../plugins/modules/static');

module.exports = async (client) => {
    client.logger.info("API enabled. Starting webserver...")
    const app = express();
    const port = PORT;
    app.get("/", (req, res) => {
        let routes = "";
        const modules = fs.readdir("./src/plugins/modules/").then(async (files) => {
            for (let file of files) {
                if (file.endsWith(".js")) {
                    let route = require(`../plugins/modules/${file}`);
                    const moduleName = file.split(".")[0];
                    routes += `<a href="/${moduleName}">${moduleName}</a><br>`;
                }
            }
            res.send(`<head><link rel="stylesheet" href="/home.css"></head><body><h1>API</h1>${routes}</body>`);
        });
    });
    app.get('/style.css', (req, res) => {
        res.sendFile(dirPath + '/style.css')
    });
    app.get('/home.css', (req, res) => {
        res.sendFile(dirPath + '/home.css');
    });
    app.listen(port, () => {
        client.logger.info(`API listening at http://localhost:${port}`)
    }
    );
    const modules = await fs.readdir("./src/plugins/modules").then(async (files) => {
        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        return jsfiles;
    });
    modules.forEach(async (module) => {
        const moduleName = module.split(".")[0];
        const moduleRoute = require(`../plugins/modules/${module}`);
        app.use(`/${moduleName}`, moduleRoute);
        client.logger.info(`Module ${moduleName} loaded.`);
    });
}