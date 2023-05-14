const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const fetch = require('node-fetch')
//axios
const axios = require('axios')
//get url from .env
const API = process.env.API
const CreditScore = require('../../plugins/schemas/credits.js');

module.exports = {
    name: ["ai", "addtokens"],
    description: "Get the amount of tokens you have.",
    categories: "Ai",
    options: [
        {
            name: "amount",
            description: "The amount of tokens you want to add.",
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: "user",
            description: "The user you want to add tokens to.",
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    run: async (interaction, client, language) => {
        //collect options
        const amount = await interaction.options.getInteger("amount");
        const user = await interaction.options.getUser("user");
        //check if user is owner
        if (interaction.user.id !== "331433556867940353") return interaction.reply("You do not have permission to use this command.")



        if (user == null) {
            const user2 = await CreditScore.findOne({ userid: interaction.user.id })
            user2.tokens = user2.tokens + amount
            await user2.save()
            const embed = new EmbedBuilder()
                .setTitle(`🪙 Tokens Added to ${user.username}'s Account`)
                .setDescription(`We have added **${amount} 🪙 tokens** to your account.`)
                .setColor("#FFC107")
                .setFooter({ text: "Thank you for using our service! 🙏" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] })
        } else {
            const id = await user.id
            const user2 = await CreditScore.findOne({ userid: id })
            user2.tokens = await user2.tokens + amount
            await user2.save()
            const embed = new EmbedBuilder()
                .setTitle(`🪙 Tokens Added to ${user.username}'s Account`)
                .setDescription(`We have added **${amount} 🪙 tokens** to your account.`)
                .setColor("#FFC107")
                .setFooter({ text: "Thank you for using our service! 🙏" })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] })
        }
    }
}



