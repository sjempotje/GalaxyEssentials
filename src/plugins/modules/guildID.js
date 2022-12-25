const express = require("express");
const router = express.Router();
const Stats = require("../../plugins/schemas/stats.js")

//needs an discord id thats a number
router.get("/:id", async (req, res) => {
let guild = await Stats.findOne({ guildID: req.params.id });
    if (!guild) return res.json({ error: "Guild not found" });
    res.json(guild);
});

module.exports = router;