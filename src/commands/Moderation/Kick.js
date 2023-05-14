const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: ["moderation", "kick"],
    description: "Kick a member",
    categories: "Moderation",
    premium: false,
    options: [
        {
            name: "user",
            description: "The user you want to kick",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "The reason why you want to kick the user",
            type: 3,
            required: false
        }
    ],
    permissions: ["KICK_MEMBERS"],
    run: async (interaction, client, language) => {
        //check kick permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({ content: "You don't have the permission to kick members", ephemeral: true });
        let user = interaction.options.getUser("user");
        let reason = interaction.options.getString("reason") || "No reason provided";
        let member = interaction.guild.members.cache.get(user.id);
        //check if the user is kickable
        if (!member.kickable) return interaction.reply({ content: "This user is not kickable", ephemeral: true });
        //kick the user
        member.kick(reason);
        //send a message
        interaction.reply({ content: "Kicked " + user.tag + " for " + reason, ephemeral: false });
    }
};
