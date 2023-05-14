const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    name: ["fun", "joke"],
    description: "Post the random face palm",
    categories: "Fun",
    premium: false,

    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
        joke = await fetch('https://some-random-api.ml/joke').then(res => res.json()).then(json => joke2 = json.joke);
        //make joke into a string
        console.log(joke) 

        const embed = new EmbedBuilder()
            .setDescription(`*Jokes on you *`)
            .addField(`Joke:`, joke)
            .setFooter({ text: `Provided by some-random-api.ml`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
        interaction.editReply({ embeds: [embed] })
    }
};