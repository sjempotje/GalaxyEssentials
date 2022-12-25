const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    res.json({
        "name": "Galaxy Essentials",
        "version": "1.0.0",
        "description": "Galaxy Essentials is a Discord bot that has many features, such as moderation, fun, utility, and more!",
        "author": "Bart Hazewinkel",
        "license": "MIT",
        "repository": {
            "type": "git",
            "url": "www.google.com"
        },
        "bugs": {
            "url": "www.google.com"
        },
        "homepage": "www.google.com"
    });
}
);
module.exports = router;
