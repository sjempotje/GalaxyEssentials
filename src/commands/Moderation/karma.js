const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: ["moderation", "karma"],
    description: "Shows the karma of everyone in the server",
    categories: "Moderation",
    premium: false,
    run: async (interaction, client, language) => {
        let url = "https://gamehub.galaxynetwork.studio/"
        //fetch data (its in json format)
        //data will be just like this: {"users":[{"id":"579996350515642388","INSULT":2,"TOXICITY":1},{"id":"769668400913317898","INSULT":2}]}
        await fetch(url).then(res => res.json()).then(json => data = json);
        //get the user with the most 🧨
        let embed = new EmbedBuilder()
            .setTitle("Karma Leaderboard")
            .setColor("RANDOM")
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        //loop through the data
    }
};