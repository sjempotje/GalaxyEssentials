const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const GConfig = require("../../plugins/guildConfig.js")

const fetch = require('node-fetch');

module.exports = {
    name: ["moderation", "info"],
    description: "Shows information about someone",
    categories: "Moderation",
    premium: false,
    options: [
        {
            name: "user",
            description: "The user you want to see the information of",
            type: 6,
            required: false
        }
    ],
    permissions: ["MANAGE_GUILD"],

    run: async (interaction, client, language) => {
        //show the info of the user
        let user = interaction.options.getUser("user") || interaction.user;
        let member = interaction.guild.members.cache.get(user.id);
        let roles = member.roles.cache.map(role => role.toString()).join(", ");
        let guildID = interaction.guild.id;
        let embed = new EmbedBuilder()
            .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            //send a nice white color 
            .setColor(client.color)
            
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        //now we make the fields
        embed.addFields(
            { name: "User ID", value: user.id, inline: true },
            { name: "Nickname", value: member.nickname || "None", inline: true },
            { name: "Account Created", value: user.createdAt.toUTCString(), inline: true },
            { name: "Joined Server", value: member.joinedAt.toUTCString(), inline: true },
            { name: "Roles", value: roles, inline: true },
            { name: "Bot", value: user.bot ? "Yes" : "No", inline: true },
            { name: "Permissions", value: member.permissions.toArray().join(", "), inline: true },
            { name: "Guild id", value: guildID, inline: true }
        )
        interaction.reply({ embeds: [embed] })
    }
};
