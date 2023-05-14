const express = require("express");
const router = express.Router();
//make database connection
const Hunt = require('../schemas/hunt.js');
//get all users
const getAllData = async () => {
    const users = await Hunt.find();
    return users;
}

//make api points for getting a specific user and then go on with /specific data
router.get("/user/:username", async (req, res) => {
    // Check if user exists, ignoring case
    const user = await Hunt.findOne({ username: req.params.username.toLowerCase() });
    if (!user) {
      return res.status(404).send("User not found");
    }
  
    // Return the user's data as an object
    const userData = {
      username: user.username,
      focustime: user.focustime,
      permfocus: user.permfocus,
      shopper: user.shopper,
      status: user.status,
      uuid: user.uuid,
      discordid: user.discordid,
    };
    res.send(userData);
  });

//make a new api point to get focus time of a specific user
router.get("/focustime/:username", async (req, res) => {
    // Check if user exists; not case sensitive
    const user = await Hunt.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).send("User not found");
    res.send(user.focustime);
});
  
  // Get perm focus time of a specific user
router.get("/permfocus/:username", async (req, res) => {
    // Check if user exists; not case sensitive
    const user = await Hunt.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).send("User not found");
    res.send(user.permfocus);
});
  
  // Get shopper status of a specific user
router.get("/shopper/:username", async (req, res) => {
    // Check if user exists; not case sensitive
    const user = await Hunt.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).send("User not found");
    res.send(user.shopper);
});
  
  // Get status of a specific user
router.get("/status/:username", async (req, res) => {
    // Check if user exists; not case sensitive
    const user = await Hunt.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).send("User not found");
    res.send(user.status);
});
  
  // Get UUID of a specific user
router.get("/uuid/:username", async (req, res) => {
    // Check if user exists; not case sensitive
    const user = await Hunt.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).send("User not found");
    res.send(user.uuid);
});
  
  // Get Discord ID of a specific user
router.get("/discordid/:username", async (req, res) => {
    // Check if user exists; not case sensitive
    const user = await Hunt.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).send("User not found");
    res.send(user.discordid);
});

router.get("/status/:username", async (req, res) => {
    try {
      // check if user exists, case insensitive
      const user = await Hunt.findOne({ username: req.params.username.toLowerCase() });
      if (!user) {
        return res.status(404).send("User not found");
      }
      
      // send the user's status as the response
      res.send(user.status);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
});

router.get("/", async (req, res) => {
    const apiPoints = [
        { path: "/focustime/:username", description: "Get the focus time for a specific user" },
        { path: "/permfocus/:username", description: "Get the permanent focus time for a specific user" },
        { path: "/shopper/:username", description: "Get the shopper status for a specific user" },
        { path: "/status/:username", description: "Get the status for a specific user" },
        { path: "/uuid/:username", description: "Get the UUID for a specific user" },
        { path: "/discordid/:username", description: "Get the Discord ID for a specific user" },
    ];
    res.send(apiPoints);
});

//export router
module.exports = router;
module.exports.name = "hunt";