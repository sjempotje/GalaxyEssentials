//import discord
const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const fs = require("fs").promises;
const path = require('path');

function removeDuplicates(arr) {
  return [...new Set(arr)];
}

module.exports = async (client) => {
    client.logger.info(`Log Parser Loaded!`);
    client.logger.info(`Getting the log files...`);
    //get the log files
    const logfiles = await fs.readdir(path.join(__dirname, 'modules/logs'));
    //check if the files end with .log
    const logfilesfiltered = logfiles.filter(file => file.endsWith('.log'));

    const names = []; // array to store the names

    for (const logfile of logfilesfiltered) {
        const filePath = path.join(__dirname, 'modules/logs', logfile);
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // filter out lines with "Ignoring player info update for unknown player", "Entity", "Experience", "points", "Not all defined tags for registry", "Loaded 0 advancements", and "worker threads"
        const filteredContent = fileContent.split('\n').filter(line => !line.includes('Ignoring player info update for unknown player') && !line.includes('Entity') && !line.includes('Experience') && !line.includes('points') && !line.includes('Not all defined tags for registry') && !line.includes('Loaded 0 advancements') && !line.includes('worker threads')).join('\n');

        // extract names from lines with "was slain by"
        const slainByLines = filteredContent.split('\n').filter(line => line.includes('was slain by'));
        for (const slainByLine of slainByLines) {
            const startIndex = slainByLine.indexOf(' by ') + 4;
            const endIndex = slainByLine.indexOf('.');
            const namesArray = slainByLine.slice(startIndex, endIndex).split(' and ').map(name => name.replace(/\? /g, ''));
            names.push(...namesArray);
        }

        // save the filtered content to a new file
        const filteredFilePath = path.join(__dirname, 'modules/logs', `filtered_${logfile}`);
        await fs.writeFile(filteredFilePath, filteredContent);

        client.logger.info(`Filtered log saved to ${filteredFilePath}`);
    }

    const uniqueNames = removeDuplicates(names);

    //add names to database
    const Hunt = require('./schemas/hunt.js');
    for (const name of uniqueNames) {
        const hunt = await Hunt.findOne({ username: name });
        if (hunt) {
            hunt.status = true;
            await hunt.save();
        } else {
            const newHunt = new Hunt({
                username: name,
                status: true,
            });
            await newHunt.save();
        }
    }

}
