const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fetch = require('node-fetch');


module.exports = {
  name: ["reload"],
  description: "Reloads the command handler",
  options: [],
  category: "Admin",
  run: async (interaction, client, language) => {
    const reloadcommands = require("../../plugins/autoDeploy.js")(client);
    //check if the user is the owner
    if(interaction.user.id != client.owner) return interaction.reply({ content: "You are not the owner of this bot!" });
    const reload = new EmbedBuilder()
        .setDescription("Want to reload the command handler?")
        .setColor(client.color)
        .setFooter({ text: `© ${interaction.guild.members.me.displayName}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
    //add the buttons
    const row = new ActionRowBuilder()
        .addComponents(new ButtonBuilder()
            .setStyle('Success')
            .setLabel('Yes')
            .setCustomId('yes')
        )
        .addComponents(new ButtonBuilder()
            .setStyle('Danger')
            .setLabel('No')
            .setCustomId('no')
        )

    //send the embed
    await interaction.reply({ embeds: [reload], components: [row] });
    //create a collector
    const filter = i => i.customId === 'yes' || i.customId === 'no';
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
    //when a button is clicked
    collector.on('collect', async i => {
        // if the button is yes
        if (i.customId === 'yes') {
            // unload commands
            const unloadedCommands = [];
            client.commands.forEach(cmd => {
                if (cmd.category !== "Admin") {
                    client.commands.delete(cmd.name);
                    unloadedCommands.push(cmd.name[0]);
                }
            });
            // load commands
            ["loadCommand"].forEach(x => require(`../../handlers/${x}`)(this));
            // make a new embed
            const reload = new EmbedBuilder()
                .setDescription(`Reloaded the command handler! Unloaded commands: ${unloadedCommands.join(", ")}`)
                .setColor(client.color)
                .setFooter({ text: `© ${interaction.guild.members.me.displayName}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            // edit the embed
            i.update({ embeds: [reload], components: [] });
        } else {
            // if the button is no
            const cancel = new EmbedBuilder()
                .setDescription("Command handler reload has been cancelled.")
                .setColor(client.color)
                .setFooter({ text: `© ${interaction.guild.members.me.displayName}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            i.update({ embeds: [cancel], components: [] });
        }
    });
    collector.on('end', () => {
        // remove buttons after collector expires
        row.components.forEach(component => component.setDisabled(true));
        interaction.editReply({ embeds: [reload], components: [row] });
    });
  }
};