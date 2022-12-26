const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');

module.exports = {
    name: ["games", "runningmatches"],
    description: "Find a match",
    categories: "Games",
    premium: false,
    run: async (interaction, client, language) => {
        //temp embed
        let embed = new EmbedBuilder()
            .setTitle("Running matches")
            .setColor("RANDOM")

        //send the embed
        interaction.reply({ embeds: [embed] })
    }
};