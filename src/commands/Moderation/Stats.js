const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const { stringify } = require('querystring');

const Stats = require("../../plugins/schemas/stats.js")


module.exports = {
    name: ["moderation", "stats"],
    description: "Get the stats of the bot",
    categories: "Moderation",
    premium: false,
    
    run: async (interaction, client, language) => {
        const idvanguild = interaction.guild.id;
        console.log(idvanguild)
        const embed = new EmbedBuilder()
            .setTitle("Stats")
            .setDescription("Here are the stats of the bot")
            //make it so that it still loading
            .addFields(
                { name: "Guild id", value: "Loading...", inline: true },
                { name: "Guild name", value: "Loading...", inline: true },
                { name: "Guild icon", value: "Loading...", inline: true },
                { name: "Guild owner", value: "Loading...", inline: true },
                { name: "Guild owner id", value: "Loading...", inline: true },
                { name: "Guild members", value: "Loading...", inline: true },
                { name: "Guild channels", value: "Loading...", inline: true },
                { name: "Guild roles", value: "Loading...", inline: true },
                { name: "Guild boosts", value: "Loading...", inline: true },
                { name: "Guild banned members", value: "Loading...", inline: true },
                { name: "Guild kicked members", value: "Loading...", inline: true },
            )
            .setFooter(
                { text: "Loading...", iconURL: client.user.displayAvatarURL({ dynamic: true }) }
            )
                
            .setColor(client.color)
            .setTimestamp();
        //send the embed
        await interaction.reply({ embeds: [embed], ephemeral: false });


        const owner = await interaction.guild.fetchOwner()
        if (await Stats
            .findOne({ guildID: interaction.guild.id })
            .exec() == null) {
            const newStats = new Stats({
                guildID: idvanguild,
                guildName: interaction.guild.name,
                guildIcon: interaction.guild.iconURL(),
                guildOwner: owner.displayName,
                guildOwnerID: interaction.guild.ownerId,
                guildMembers: interaction.guild.memberCount,
                guildChannels: interaction.guild.channels.cache.size,
                guildRoles: interaction.guild.roles.cache.size,
                guildBoosts: interaction.guild.premiumSubscriptionCount,
                guildBannedMembers: interaction.guild.bans.cache.size,
                guildKickedMembers: interaction.guild.kickCount
            });
            await newStats.save();
        }

        //update database of the guild

        const stats = await Stats
            .findOne({ guildID: interaction.guild.id })
            .exec();

        //log the data
        console.log(stats);

        //wait 5 seconds
        // await new Promise(resolve => setTimeout(resolve, 5000));
        //change the stats numbers to a string so that it can be displayed in the embed
        stats.guildID2 = "" + stats.guildID;
        stats.guildOwnerID2 = "" + stats.guildOwnerID;
        stats.guildMembers2 = "" + stats.guildMembers;
        stats.guildChannels2 = "" + stats.guildChannels;
        stats.guildRoles2 = "" + stats.guildRoles;
        stats.guildBoosts2 = "" + stats.guildBoosts;
        stats.guildBannedMembers2 = "" + stats.guildBannedMembers;
        stats.guildKickedMembers2 = "" + stats.guildKickedMembers;

        if (stats.guildIcon == null) {
            stats.guildIcon = "No icon";
        }

        embed
            .setFooter(
                { text: "Done!", iconURL: client.user.displayAvatarURL({ dynamic: true }) }
            )
            .setDescription("Here are the stats of the bot")
            .setFields(
                { name: "Guild id", value: stats.guildID2, inline: true },
                { name: "Guild name", value: stats.guildName, inline: true },
                // { name: "Guild icon", value: stats.guildIcon, inline: true },
                { name: "Guild owner", value: stats.guildOwner, inline: true },
                { name: "Guild owner id", value: stats.guildOwnerID2, inline: true },
                { name: "Guild members", value: stats.guildMembers2, inline: true },
                { name: "Guild channels", value: stats.guildChannels2, inline: true },
                { name: "Guild roles", value: stats.guildRoles2, inline: true },
                { name: "Guild boosts", value: stats.guildBoosts2, inline: true },
                { name: "Guild banned members", value: stats.guildBannedMembers2, inline: true },
                { name: "Guild kicked members", value: stats.guildKickedMembers2, inline: true },
            )
            .setColor(client.color)
            .setTimestamp();


        //edit the message
        interaction.editReply({ embeds: [embed], ephemeral: false });


    }
};