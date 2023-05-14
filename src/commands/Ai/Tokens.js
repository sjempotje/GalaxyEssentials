const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const fetch = require('node-fetch')
//axios
const axios = require('axios')
//get url from .env
const API = process.env.API
const CreditScore = require('../../plugins/schemas/credits.js');

module.exports = {
    name: ["ai", "tokens"],
    description: "Get the amount of tokens you have.",
    categories: "Ai",
    options: [],
    run: async (interaction, client, language) => {
        const user = await CreditScore.findOne({ userid: interaction.user.id })
        if (!user) return interaction.reply("You do not have any tokens.")
        interaction.reply(`You have ${user.tokens} tokens.`)
    }
}
