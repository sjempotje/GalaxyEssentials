const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const fs = require("fs").promises;
//import import {createWriteStream} from 'fs'
const path = require('path');
const Credits = require('./schemas/credits.js');

module.exports = async (client) => {
    setInterval(async () => {
        const users = await Credits.find({});
        for (const user of users) {
          const userID = user.userid;
          const refreshDate = user.refreshdate;
          if (Date.now() > refreshDate) {
            const refreshAmount = user.refreshamount;
            const newTokens = user.tokens + refreshAmount;
            //add a day to the refresh date
            const newRefreshDate = Date.now() + 86400000;
            await Credits.updateOne({ userid: userID }, { tokens: newTokens, refreshdate: newRefreshDate });
          }
        }
      }, 1000);
}