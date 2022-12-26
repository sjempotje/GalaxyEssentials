const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: ["moderation", "roles"],
    description: "Makes the roles selection message",
    usage: "roles",
    category: "moderation",
    //needs to be an admin
    permissions: [PermissionsBitField.Flags.Administrator],
    run: async (interaction, client) => {
        //the following roles and their ids
        const roles = [
            {
                name: "Match Ping",
                id: "1056920784930619463"
            },
            {
                name: "Event Ping",
                id: "1055069488397168651"
            },
            {
                name: "Video Ping",
                id: "1055468668739391578"
            }
        ];
        //the embed
        const embed = new EmbedBuilder()
            .setTitle("Roles")
            .setDescription("Click the buttons below to get the roles you want!")
            //set color to green
            .setColor(0x00ff00)
            .setTimestamp();
        //the action row
        const actionRow = new ActionRowBuilder();
        //for each role
        for (const role of roles) {
            //add a button
            actionRow.addComponents(new ButtonBuilder()
                .setStyle("Primary")
                .setLabel(role.name)
                .setCustomId(role.id)
            );
        }
        //send the embed and the action row
        const message = await interaction.reply({ embeds: [embed], components: [actionRow] });

        //create a collector and it needs to be always listening
        const collector = message.createMessageComponentCollector({ time: 0 });
        collector.on("collect", async (interaction) => {
            //check what button was clicked
            console.info(interaction.customId);
            switch (interaction.customId) {
                //if the button was the one with the id of the match ping role
                case "1056920784930619463":
                    //get the role
                    const matchPingRole = interaction.guild.roles.cache.get("1056920784930619463");
                    //if the user already has the role
                    if (interaction.member.roles.cache.has(matchPingRole.id)) {
                        //remove the role
                        await interaction.member.roles.remove(matchPingRole);
                        //send a message to the user saying that the role was removed but only he can see it
                        await interaction.reply({ content: "Removed the role from " + interaction.member.user.username, ephemeral: true });
                        //delete the message after 5 seconds
                        setTimeout(() => {
                            interaction.deleteReply();
                        }
                            , 5000);
                    } else {
                        //add the role
                        await interaction.member.roles.add(matchPingRole);
                        //send a message to the user but only he can see it and it deletes itself after 5 seconds
                        await interaction.reply({ content: "Added the role to  " + interaction.member.user.username, ephemeral: false });
                        //delete the message after 5 seconds
                        setTimeout(() => {
                            interaction.deleteReply();
                        }
                            , 5000);
                    }
                    break;
                //if the button was the one with the id of the event ping role
                case "1055069488397168651":
                    //get the role
                    const eventPingRole = interaction.guild.roles.cache.get("1055069488397168651");
                    //if the user already has the role
                    if (interaction.member.roles.cache.has(eventPingRole.id)) {
                        //remove the role
                        await interaction.member.roles.remove(eventPingRole);
                        await interaction.reply({ content: "Removed the role from " + interaction.member.user.username, ephemeral: true });
                        setTimeout(() => {
                            interaction.deleteReply();
                        }
                            , 5000);
                    } else {
                        //add the role
                        await interaction.member.roles.add(eventPingRole);
                        await interaction.reply({ content: "Added the role to " + interaction.member.user.username, ephemeral: false });
                        setTimeout(() => {
                            interaction.deleteReply();
                        }
                            , 5000);
                    }
                    break;
                //if the button was the one with the id of the video ping role
                case "1055468668739391578":
                    //get the role
                    const videoPingRole = interaction.guild.roles.cache.get("1055468668739391578");
                    //if the user already has the role
                    if (interaction.member.roles.cache.has(videoPingRole.id)) {
                        //remove the role
                        await interaction.member.roles.remove(videoPingRole);
                        await interaction.reply({ content: "Removed the role from " + interaction.member.user.username, ephemeral: true });
                        setTimeout(() => {
                            interaction.deleteReply();
                        }
                            , 5000);
                    }
                    else {
                        //add the role
                        await interaction.member.roles.add(videoPingRole);
                        await interaction.reply({ content: "Added the role to " + interaction.member.user.username, ephemeral: false });
                        setTimeout(() => {
                            interaction.deleteReply();
                        }
                            , 5000);
                    }
                    break;
            }
        });
    }
};
