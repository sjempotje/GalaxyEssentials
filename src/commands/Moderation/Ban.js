const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: ["moderation", "ban"],
    description: "Ban a member",
    categories: "Moderation",
    premium: false,
    options: [
        {
            name: "user",
            description: "The user you want to ban",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "The reason why you want to ban the user",
            type: 3,
            required: false
        }
    ],
    permissions: ["BAN_MEMBERS"],
    run: async (interaction, client, language) => {
        //check ban permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "You don't have the permission to ban members", ephemeral: true });
        let user = interaction.options.getUser("user");
        let reason = interaction.options.getString("reason") || "No reason provided";
        let member = interaction.guild.members.cache.get(user.id);
        //check if the user is banable
        if (!member.bannable) return interaction.reply({ content: "This user is not banable", ephemeral: true });
        //ban the user
        member.ban(reason);
        //send a message
        interaction.reply({ content: "Banned " + user.tag + " for " + reason, ephemeral: false });	
    }
};