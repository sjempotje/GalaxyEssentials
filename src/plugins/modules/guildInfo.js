const express = require("express");
const router = express.Router();
const Stats = require("../../plugins/schemas/stats.js")

router.get("/", async (req, res) => {
    //add all the routes here
    let guilds = await Stats.find();
    let guildsArray = [];
    guilds.forEach(guild => {
        let guildObject = {
            guildID: guild.guildID,
            guildName: guild.guildName,
            guildIcon: guild.guildIcon,
            guildOwner: guild.guildOwner,
            guildOwnerID: guild.guildOwnerID,
            guildMembers: guild.guildMembers,
            guildChannels: guild.guildChannels,
            guildRoles: guild.guildRoles,
            guildBoosts: guild.guildBoosts,
            guildBannedMembers: guild.guildBannedMembers,
            guildKickedMembers: guild.guildKickedMembers
        }
        guildsArray.push(guildObject);
    });
    res.json(guildsArray);
});
    

//add the following endpoints using: 
// {
//     "guildID": "1039538192631746590",
//     "guildName": "The Game Hub",
//     "guildIcon": "https://cdn.discordapp.com/icons/1039538192631746590/7679435450171982a5a2306a85f497ee.webp",
//     "guildOwner": "TheInternetRambo",
//     "guildOwnerID": "769668400913317898",
//     "guildMembers": 47,
//     "guildChannels": 65,
//     "guildRoles": 33,
//     "guildBoosts": 0,
//     "guildBannedMembers": 0,
//     "guildKickedMembers": null,
//   }

router.get("/members/:id", async (req, res) => {
    let guild = await Stats.findOne({ guildID: req.params.id });
    if (!guild) return res.json({ error: "Guild not found" });
    //guildMembers is an int32
    //make a new object with the guildMembers
    res.json({ guildMembers: guild.guildMembers });
});

router.get("/guildname/:id", async (req, res) => {
    let guild = await Stats.findOne({ guildID: req.params.id });
    if (!guild) return res.json({ error: "Guild not found" });
    //guildName is a string
    //make a new object with the guildName
    res.json({ guildName: guild.guildName });
});

router.get("/guildicon/:id", async (req, res) => {
    let guild = await Stats.findOne({ guildID: req.params.id });
    if (!guild) return res.json({ error: "Guild not found" });
    //guildIcon is a string
    //if guildIcon is null, return a default icon
    if (!guild.guildIcon) return res.json({ guildIcon: "https://cdn.discordapp.com/embed/avatars/4.png" });
    //make a new object with the guildIcon
    res.json({ guildIcon: guild.guildIcon });
});

router.get("/guildowner/:id", async (req, res) => {
    let guild = await Stats.findOne({ guildID: req.params.id });
    if (!guild) return res.json({ error: "Guild not found" });
    //guildOwner is a string
    //make a new object with the guildOwner
    res.json({ guildOwner: guild.guildOwner });
});

router.get("/guildownerid/:id", async (req, res) => {
    let guild = await Stats.findOne({ guildID: req.params.id });
    if (!guild) return res.json({ error: "Guild not found" });
    //guildOwnerID is a string
    //make a new object with the guildOwnerID
    res.json({ guildOwnerID: guild.guildOwnerID });
});

router.get("/guildchannels/:id", async (req, res) => {
    let guild = await Stats.findOne({ guildID: req.params.id });
    if (!guild) return res.json({ error: "Guild not found" });
    //guildChannels is an int32
    //make a new object with the guildChannels
    res.json({ guildChannels: guild.guildChannels });
});

router.get("/guildroles/:id", async (req, res) => {
    let guild = await Stats.findOne({ guildID: req.params.id });
    if (!guild) return res.json({ error: "Guild not found" });
    //guildRoles is an int32
    //make a new object with the guildRoles
    res.json({ guildRoles: guild.guildRoles });
});

router.get("/guildboosts/:id", async (req, res) => {
    let guild = await Stats.findOne({ guildID: req.params.id });
    if (!guild) return res.json({ error: "Guild not found" });
    //guildBoosts is an int32
    //make a new object with the guildBoosts
    res.json({ guildBoosts: guild.guildBoosts });
});

router.get("/guildbannedmembers/:id", async (req, res) => {
    let guild = await Stats.findOne({ guildID: req.params.id });
    if (!guild) return res.json({ error: "Guild not found" });
    //guildBannedMembers is an int32
    //make a new object with the guildBannedMembers
    res.json({ guildBannedMembers: guild.guildBannedMembers });
});

router.get("/guildkickedmembers/:id", async (req, res) => {
    let guild = await Stats.findOne({ guildID: req.params.id });
    if (!guild) return res.json({ error: "Guild not found" });
    //guildKickedMembers is an int32
    //if null, return 0
    if (!guild.guildKickedMembers) return res.json({ guildKickedMembers: 0 });
    //make a new object with the guildKickedMembers
    res.json({ guildKickedMembers: guild.guildKickedMembers });
});

module.exports = router;