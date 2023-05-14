const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const fetch = require('node-fetch')
//axios
const axios = require('axios')
//get url from .env
const API = process.env.API
const CreditScore = require('../../plugins/schemas/credits.js');

module.exports = {
    name: ["ai", "leaderboard"],
    description: "Get the top 10 users with the most tokens + your tokens + total tokens.",
    categories: "Ai",
    options: [],
    run: async (interaction, client, language) => {
        //get all users
        const users = await CreditScore.find({})
        //sort users
        const sorted = users.sort((a, b) => b.tokens - a.tokens)
        //get top 10 users
        const top10 = sorted.slice(0, 10)
        //get user
        const user = await CreditScore.findOne({ userid: interaction.user.id })
        //get total tokens
        const total = users.reduce((acc, val) => acc + val.tokens, 0)
        //create embed
        const embed = new EmbedBuilder()
            .setTitle("🪙 Tokens Leaderboard")
            .setDescription(`You have ${user.tokens} tokens.\nThere are ${total} tokens in total.\n\n**Top 10 Users**`)
            .setColor("#FFC107")
            .setFooter({ text: "Thank you for using our service! 🙏" })
            .setTimestamp()
            const top10Fields = [];

            top10.forEach((user, index) => {
                //change userid to username
                const username = client.users.cache.get(user.userid);
                console.log(username);
              top10Fields.push({
                name: `#${index + 1} - ${username}`,
                value: `${user.tokens} tokens`,
                inline: true,
              });
            });
            
            embed.addFields(top10Fields);
        await interaction.reply({ embeds: [embed] })
    }
}