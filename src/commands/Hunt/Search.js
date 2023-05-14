const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ApplicationCommandOptionType } = require("discord.js");
//get database
const Hunt = require("../../plugins/schemas/hunt.js");
const choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];


module.exports = {
    name: ["search"],
    description: "Search for a player in the Hunt list.",
    categories: "Hunt",
    options: [
        {
            name: "minecraftusername",
            description: "The user you want to search for.",
            type: ApplicationCommandOptionType.String,
        },
    ],

    run: async (interaction, client, language) => {
        const minecraftusername = interaction.options.getString("minecraftusername");
        //autocomplete function show choices
    }
};