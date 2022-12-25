const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
    name: ["developer"],
    description: "Shows the developer information of the Bot (Credit)",
    categories: "Info",
    premium: false,
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
          const galaxy = new EmbedBuilder()
              .setTitle(`${client.i18n.get(language, "info", "dev_title")}`)
              .setDescription(`${client.i18n.get(language, "info", "dev_desc")}`)
              .setFooter({ text: `${client.i18n.get(language, "info", "dev_foot")}` })
              .setColor(client.color);

          const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel("Support Server")
                .setStyle("Link")
                .setURL("https://discord.gg/eZay8FNZMW")
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Source Code")
                    .setStyle("Link")
                    .setURL("https://github.com/sjempotje/galaxyessentials")
            )
        await interaction.editReply({ embeds: [galaxy], components: [row1] });

    }
};