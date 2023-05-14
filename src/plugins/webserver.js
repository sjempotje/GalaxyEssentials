const express = require("express");
const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const { PORT } = require("./config.js");
const fs = require("fs").promises;
//import import {createWriteStream} from 'fs'
const path = require('path');
const dirPath = path.join(__dirname, '../plugins/modules/static');
const bodyParser = require('body-parser')
const AdmZip = require('adm-zip');



module.exports = async (client) => {
    client.logger.info("API enabled. Starting webserver...")     
    const app = express()
     
    app.use(bodyParser.json( {limit: '500mb'} ));
    app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
    //increase the limit of the body
    app.use(express.json());
    app.set('view engine', 'ejs');
    app.set('views', dirPath);
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
    app.get('/scriptpost.js', (req, res) => {
        res.sendFile(dirPath + '/scriptpost.js');
    });
    app.get('/upload.js', (req, res) => {
        res.sendFile(dirPath + '/upload.js');
    });
    app.listen(port, () => {
        client.logger.info(`API listening at http://localhost:${port}`)
    });
    app.get('/post.css', (req, res) => {
        res.sendFile(dirPath + '/post.css');
    });

    app.get("/post", (req, res) => {
        //send static website where user can input data like: Title, Description, Image, link, embed color, etc.
        client.logger.info("test");
        res.render('post')
    });
    app.get("/upload", (req, res) => {
        res.render('upload')
    });
    app.post("/upload/:password/:id", (req, res) => {
        if (req.params.password == "jemand") {
            const base64Regex = /^data:application\/x-zip-compressed;base64,(.*)$/;
            const matches = base64Regex.exec(req.body.file);
            if (!matches) {
                res.status(400).send("Invalid base64 data");
                return;
            }
            else {
                client.logger.info("matches");
                res.status(200).send("matches");
            }
            const base64 = matches[1];
            const zip = Buffer.from(base64, 'base64');
            const timestamp = Date.now();
            client.logger.info("writing file");
            fs.writeFile(`./src/plugins/modules/zips/${timestamp}.zip`, zip, 'base64', (err, data) => {
                if (err) {
                    client.logger.info(err);
                    res.status(500).send("Error writing file");
                    return;
                }
                res.status(200).send("File written");
            });
            setTimeout(() => {
                const zipFile = new AdmZip(`./src/plugins/modules/zips/${timestamp}.zip`);
                zipFile.extractAllTo(`./src/plugins/modules/zips/${timestamp}`, true)
                setTimeout(() => {
                    fs.readdir(`./src/plugins/modules/zips/${timestamp}`).then(async (files) => {
                        for (let file of files) {
                            if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".gif")) {
                                const channel = client.channels.cache.get(req.params.id);
                                //so for every file we send it to the channel
                                channel.send({
                                    files: [{
                                        attachment: `./src/plugins/modules/zips/${timestamp}/${file}`,
                                        name: file
                                    }]
                                });
                            }
                        }
                        setTimeout(() => {
                            fs.rmdir(`./src/plugins/modules/zips/${timestamp}`, { recursive: true }).then(() => {
                            });
                            fs.unlink(`./src/plugins/modules/zips/${timestamp}.zip`).then(() => {
                            });
                        }, 20000);
                    });
                }, 10000);
            }, 40000);
            

        }
        else {
            res.status(401).send("Wrong password");
        }
    });


    // we now need to get the data from the form and send it to the api
    app.post("/post/:password/:id", (req, res) => {
        //check if password is correct
        if (req.params.password == "jemand") {
            //log the body
            client.logger.info(req.body);

            if (req.headers['content-type'] == "application/json") {
                client.logger.info(req.body);
                if (req.body.title && req.body.description) {
                    res.send("ok");
                    client.logger.info("ok");
                    let intcolor = req.body.color;
                    colorDec = parseInt(intcolor.replace('#', '0x'));
                    if (colorDec == 0) {
                        colorDec = 0x000000;
                    }


                    embed = {
                        color: colorDec,
                        title: req.body.title,
                        url: "https://discord.gg/",
                        author: {
                            name: req.body.author.name,
                            icon_url: req.body.author.icon,
                            url: req.body.author.url,
                        },
                        description: req.body.description,
                        thumbnail: {
                            url: req.body.thumb_url,
                        },
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: req.body.footer,
                            icon_url: req.body.footer_icon,
                        },
                    };

                    //if field has name undefined, then it is not a field
                    

                    if (req.body.fields != null) {
                        //get all fields
                        let fields = req.body.fields;
                        //create an array for the embed fields
                        let embedFields = [];
                        //loop through all fields
                        for (let field of fields) {
                            //create a new field
                            let newField = {
                                name: field.name,
                                value: field.value,
                                inline: field.inline,
                            };
                            //push the field to the array
                            embedFields.push(newField);
                        }
                        //set the fields to the embed
                        embed.fields = embedFields;
                    }
                    
                    //send embed to channel 1 2 or 3
                    if (req.params.id == 1) {                        
                        client.channels.cache.get("1087137825318785024").send({ embeds: [embed] });
                    } else if (req.params.id == 2) {
                        client.channels.cache.get("1087137824773517384").send({ embeds: [embed] });
                    }
                    else if (req.params.id == 3) {
                        client.channels.cache.get("1091051295995072645").send({ embeds: [embed] });
                    }
                    else {
                        client.channels.cache.get(req.params.id).send({ embeds: [embed] });
                    }
                } else {
                    res.send("missing fields");
                    client.logger.info("missing fields");
                }
            } else {
                res.send("not json");
                client.logger.info("not json");
            }
        } else {
            res.send("wrong password");
            client.logger.info("wrong password");
        }
    });

    const modules = await fs.readdir("./src/plugins/modules").then(async (files) => {
        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        return jsfiles;
    });
    modules.forEach(async (module) => {
        const moduleName = module.split(".")[0];
        const moduleRoute = require(`../plugins/modules/${module}`);
        app.use(`/${moduleName}`, moduleRoute);
        client.logger.info(`Webserver - Module ${moduleName} loaded.`);
    });
}