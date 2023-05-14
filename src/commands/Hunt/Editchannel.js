const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
//database
const StaticChannels = require('../../plugins/schemas/staticchannels.js');

module.exports = {
    name: ["static", "edit", "hunt"],
    description: "Change to other channel.",
    categories: "Hunt",
    options: [
        {
            name: "channel",
            description: "The channel you want to add to the static channel list.",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
    ],

    run: async (interaction, client, language) => {
        //make sure user has permission to use this command
        if (!interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply("You do not have permission to use this command.");

        //get channel
        const channel = interaction.options.getChannel("channel");

        //make sure channel is a text channel
        if (channel.type != "GUILD_TEXT") return interaction.reply("That is not a text channel.");

        //make sure channel is not already a static channel
        const staticchannel = await StaticChannels.findOne({ channelid: channel.id });
        if (staticchannel) return interaction.reply("That channel is already a static channel.");

        //make sure channel is for the guild
        if (channel.guild.id != interaction.guild.id) return interaction.reply("That channel is not in this guild.");

        //database stuff
        const newstaticchannel = new StaticChannels({
            huntchannel: channel.id,
            guildid: channel.guild.id
        });
        //update
        newstaticchannel.updateOne({ huntchannel: channel.id, guildid: channel.guild.id });

        //send confirmation message
        const embed = new EmbedBuilder(client)
            .setTitle("Static Channel Added")
            .setDescription(`The channel <#${channel.id}> has been added to the static channel list.`)
            .setColor(0x00FF00)
            .setTimestamp();
        interaction.reply({ embeds: [embed] });
    }
}