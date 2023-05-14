const { EmbedBuilder, ApplicationCommandOptionType, TextChannel } = require('discord.js');
//database
const CreateStaticChannels = require('../../plugins/schemas/staticchannels.js');

module.exports = {
    name: ["static", "add", "hunt"],
    description: "Add a static channel to return hunt results, people who to focus, and more.",
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

        if (!(channel instanceof TextChannel)) {
            return interaction.reply(`The channel ${channel} is not a text channel.`);
        }
        //make sure channel is not already a static channel
        const staticChannel = await CreateStaticChannels.findOne({ huntchannel: channel.id });
        if (staticchannel) return interaction.reply("That channel is already a static channel.");

        //make sure channel is for the guild
        if (channel.guild.id != interaction.guild.id) return interaction.reply("That channel is not in this guild.");
        else {
        const newstaticchannel = new CreateStaticChannels({
            huntchannel: channel.id,
            guildid: channel.guild.id
        });
        newstaticchannel.save();
        }

        //send confirmation message
        const embed = new EmbedBuilder(client)
            .setTitle("Static Channel Added")
            .setDescription(`The channel <#${channel.id}> has been added to the static channel list.`)
            .setColor(0x00FF00)
            .setTimestamp();
        interaction.reply({ embeds: [embed] });
    }
}