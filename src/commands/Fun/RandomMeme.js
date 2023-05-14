const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');


module.exports = {
    name: ["fun", "randommeme"],
    description: "Get a random meme from reddit",
    usage: "randommeme",
    categories: "Fun",
    run: async (interaction, client, language) => {
        //get meme from https://meme-api.com/gimme
        const res = await fetch('https://meme-api.com/gimme');
        const json = await res.json();
        //set nsfw to true.
        json.nsfw == true;
        //construct embed
        const embed = new EmbedBuilder()
            .setTitle(json.title)
            .setURL(json.postLink)
            .setImage(json.url)
            //set color to green if the meme is safe, red if it is nsfw (colors in hex)
            .setColor(json.nsfw ? 0xff0000 : 0x00ff00)
            .setFooter({ text: `👍 ${json.ups} | 👎 ${json.downs} | 💬 ${json.commentsNum}` })
        //if the meme is nsfw, add a button to the embed
        if (json.nsfw == true) {
            const row = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setStyle('Danger')
                    .setLabel('I am 18+')
                    .setCustomId('meme_nsfw')
                )
        }
        //add a refresh button to the embed
        const row = new ActionRowBuilder()
            .addComponents(new ButtonBuilder()
                .setStyle('Primary')
                .setLabel('Refresh')
                .setCustomId('meme_refresh')
            )
            
        //send embed with buttons
        interaction.reply({ embeds: [embed], components: [row] });

        //create a collector for the buttons
        const filter = i => i.customId === 'meme_nsfw' || i.customId === 'meme_refresh';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
        //when a button is clicked
        collector.on('collect', async i => {
            //if the button is the nsfw button
            if (i.customId === 'meme_nsfw') {
                //edit the embed to remove the button
                i.update({ embeds: [embed], components: [] });
            }
            //if the button is the refresh button
            if (i.customId === 'meme_refresh') {
                //get a new meme
                const res = await fetch('https://meme-api.com/gimme');
                const json = await res.json();
                //set nsfw to true.
                //construct a new embed
                const embed = new EmbedBuilder()
                    .setTitle(json.title)
                    .setURL(json.postLink)
                    .setImage(json.url)
                    .setColor(json.nsfw ? 0xff0000 : 0x00ff00)
                    .setFooter({ text: `👍 ${json.ups} | 👎 ${json.downs} | 💬 ${json.commentsNum}` })
                //if the meme is nsfw, add a button to the embed
                if (json.nsfw === true) {
                    //add a button to the embed
                    const row2 = new ActionRowBuilder()
                        .addComponents(new ButtonBuilder()
                                .setStyle('Danger')
                                .setLabel('I am 18+')
                                .setCustomId('meme_nsfw')
                        )
                }
                //edit the embed
                i.update({ embeds: [embed], components: [row] });
            }
        });
        //when the collector times out
        collector.on('end', collected => {
            //edit the embed to remove the buttons
            interaction.editReply({ embeds: [embed], components: [] });
        }
        );
    }
}
