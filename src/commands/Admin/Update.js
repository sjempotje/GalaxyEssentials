//send a message to a specific channel on a server:
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    name: ["settings", "update"],
    description: "Updates the bot!",
    categories: "Admin",
    run: async (interaction, client, language) => {
        const fs = require('fs');
        //file located one directory above the current directory read Update.json
        console.log(file)

        //make a simple embed
        const update = new EmbedBuilder(true)
            .setTitle("Update")
            .setDescription("Updating the bot...")
            .setTimestamp()
        await interaction.editReply({ embeds: [update] });

        process.exit();
    }
};
