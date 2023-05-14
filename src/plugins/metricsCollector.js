//import discord
const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const fs = require("fs").promises;
//import import {createWriteStream} from 'fs'
const path = require('path');

module.exports = async (client) => {
    client.logger.info(`Metrics Collector Loaded!`);
    const filePath = path.join(__dirname, 'user-status.json');

    // Create an empty array to store user data
    let userData = [];
    
    // Loop through every guild in the bot
    // client.guilds.cache.forEach(async (guild) => {
    //     try {
    //       const members = await guild.members.fetch();
    //       members.forEach((member) => {
    //         const userDataObject = {
    //           id: member.user.id,
    //           status: member.presence.status,
    //           game: member.presence.activity ? member.presence.activity.name : 'None',
    //           guildId: guild.id,
    //           guildName: guild.name,
    //         };
            
    //         // Add the user data object to the array
    //         userData.push(userDataObject);
    //       });
    //     } catch (error) {
    //       console.error(`Error fetching members for guild ${guild.name}: ${error}`);
    //     }
    //   });
    // try {
    //   await fs.writeFile(filePath, JSON.stringify(userData, null, 2));
    //   //close the file
    //   console.log('User data saved to JSON file.');
    // } catch (error) {
    //   console.error(`Error writing user data to file: ${error}`);
    // }
}