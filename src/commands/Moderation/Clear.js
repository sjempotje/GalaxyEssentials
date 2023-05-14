const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: ["moderation", "clear"],
    description: "Clears messages",
    categories: "Moderation",
    premium: false,
    options: [
        {
            name: "amount",
            description: "The amount of messages you want to clear, default is 1",
            type: 4,
            required: false
        }
    ],
    permissions: ["MANAGE_MESSAGES"],
    run: async (interaction, client, language) => {
        //clear messages in the channel the command was used in
        let amount = interaction.options.getInteger("amount");
        //check if the user has the permission to manage messages
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: "You don't have the permission to manage messages", ephemeral: true });
        //check if the amount is a number if not change it to 1
        if (isNaN(amount) || amount > 100 || amount < 1) {
            amount = 1;
        }
        amount++;
        interaction.channel.bulkDelete(amount);
        amount--;
        interaction.reply({ content: "Deleted " + amount + " messages", ephemeral: true });
    }
};