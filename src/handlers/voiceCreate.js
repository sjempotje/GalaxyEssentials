// const { PermissionsBitField, InteractionType, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType } = require('discord.js');
const GLang = require("../../plugins/schemas/language.js");

/**
 * @param {CommandInteraction} interaction
 */

module.exports = async(client, interaction) => {
    client.logger.info("Voice state updated");
    //check if user joined a specific channel
    client.on("voiceStateUpdate", async(oldState, newState) => {
        //check if user joined a specific channel
        if (newState.channelID === "1066501922758066297") {
            console.info("User joined a specific channel");
        }
    });
}