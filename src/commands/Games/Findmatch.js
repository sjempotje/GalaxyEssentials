const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
module.exports = {
    name: ["games", "findmatch"],
    description: "Find a match",
    categories: "Games",
    premium: false,
    options: [
        {
            name: "game",
            description: "The game you want to play",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Among-Us",
                    value: "amongus"
                },
                {
                    name: "Minecraft",
                    value: "minecraft"
                },
                {
                    name: "Fortnite",
                    value: "fortnite"
                },
                {
                    name: "Valorant",
                    value: "valorant"
                },
                {
                    name: "League-of-Legends",
                    value: "lol"
                },
                {
                    name: "Overwatch",
                    value: "overwatch"
                },
                {
                    name: "Apex-Legends",
                    value: "apex"
                },
                {
                    name: "Call-of-Duty",
                    value: "cod"
                },
                {
                    name: "Roblox",
                    value: "roblox"
                },
                {
                    name: "Genshin-Impact",
                    value: "genshin"
                },
                {
                    name: "Other",
                    value: "other"
                }
            ]
        },
        {
            name: "platform",
            description: "The platform you want to play on",
            type: 3,
            required: true,
            choices: [
                {
                    name: "PC",
                    value: "pc"
                },
                {
                    name: "Xbox",
                    value: "xbox"
                },
                {
                    name: "Playstation",
                    value: "playstation"
                },
                {
                    name: "Nintendo-Switch",
                    value: "switch"
                },
                {
                    name: "Mobile",
                    value: "mobile"
                },
                {
                    name: "Other",
                    value: "other"
                }
            ]
        },
        {
            name: "region",
            description: "The region you want to play in",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Europe",
                    value: "eu"
                },
                {
                    name: "North-America",
                    value: "na"
                },
                {
                    name: "South-America",
                    value: "sa"
                },
                {
                    name: "Asia",
                    value: "asia"
                },
                {
                    name: "Australia",
                    value: "au"
                },
                {
                    name: "Africa",
                    value: "africa"
                },
                {
                    name: "Other",
                    value: "other"
                }
            ]
        },
        {
            name: "age",
            description: "The age of the players you want to play with",
            type: 3,
            required: true,
            choices: [
                {
                    name: "13-17",
                    value: "13-17"
                },
                {
                    name: "18-24",
                    value: "18-24"
                },
                {
                    name: "25-34",
                    value: "25-34"
                },
                {
                    name: "35-44",
                    value: "35-44"
                },
                {
                    name: "45-54",
                    value: "45-54"
                },
                {
                    name: "55-64",
                    value: "55-64"
                },
                {
                    name: "65+",
                    value: "65+"
                }
            ]
        },
        {
            name: "language",
            description: "The language you want to play in",
            type: 3,
            required: true,
            choices: [
                {
                    name: "English",
                    value: "english"
                },
                {
                    name: "German",
                    value: "german"
                },
                {
                    name: "French",
                    value: "french"
                },
                {
                    name: "Spanish",
                    value: "spanish"
                },
                {
                    name: "Italian",
                    value: "italian"
                },
                {
                    name: "Russian",
                    value: "russian"
                },
                {
                    name: "Japanese",
                    value: "japanese"
                },
                {
                    name: "Chinese",
                    value: "chinese"
                },
                {
                    name: "Korean",
                    value: "korean"
                },
                {
                    name: "Dutch",
                    value: "dutch"
                },
                {
                    name: "Other",
                    value: "other"
                }
            ]
        },
        {
            name: "description",
            description: "A description of the match you want to play",
            type: 3,
            required: true
        }
    ],
    run: async (interaction, client) => {
        const game = interaction.options.getString("game");
        const platform = interaction.options.getString("platform");
        const region = interaction.options.getString("region");
        const age = interaction.options.getString("age");
        const language = interaction.options.getString("language");
        const description = interaction.options.getString("description");
        const embed = new EmbedBuilder()
            .setTitle("Find a match")
            .setDescription(`**Game:** ${game}\n**Platform:** ${platform}\n**Region:** ${region}\n**Age:** ${age}\n**Language:** ${language}\n**Description:** ${description}`)
            .setFooter(
                { text: `Requested by ${interaction.user.tag} | Pending`, iconURL: client.user.displayAvatarURL({ dynamic: true }) }
            )
            .setTimestamp();
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Join")
                    .setStyle("Success")
                    .setCustomId("join")
            );
        
        const text = "You have successfully created a match!, please wait for someone to join your match."
        interaction.reply({ content: text, ephemeral: true });

        //now we send the message to the channel 1056720445396754503
        const channel = await client.channels.fetch("1056720445396754503");
        const msg = await channel.send({ embeds: [embed], components: [row] });

        //now we create a collector for the button
        const filter = (button) => button.user.id != interaction.user.id;
        const collector = msg.channel.createMessageComponentCollector({ filter, time: 60000 });
        //if filter fails, we send a message to the channel
        collector.on("end", async (collected) => {
            if (collected.size === 0) {
                text2 = "You can't join your own match!"
                interaction.reply({ content: text2, ephemeral: true });
            }
        });

        collector.on("collect", async (button) => {
            if (button.customId === "join") {
                button.deferUpdate();
                const embed = new EmbedBuilder()
                    .setTitle("Find a match")
                    .setDescription(`**Game:** ${game}\n**Platform:** ${platform}\n**Region:** ${region}\n**Age:** ${age}\n**Language:** ${language}\n**Description:** ${description}\n\n**Joined by:** ${button.user.tag}`)
                    .setFooter(
                        { text: `Requested by ${interaction.user.tag} | Done`, iconURL: client.user.displayAvatarURL({ dynamic: true }) }
                    )
                    .setTimestamp();
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Join")
                            .setStyle("Success")
                            .setDisabled(true)
                            .setCustomId("join")
                    );
                msg.edit({ embeds: [embed], components: [row] });

                //create a custom channel with the name of the game and the id of the user like this: game-userid
                //in category 1056733178066378795
                const category = await client.channels.fetch("1056733178066378795");
                const channel = await category.guild.channels.create({
                    name: `${game}-${button.user.id}`,
                    type: ChannelType.GuildText,
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: button.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                        },
                        {
                            id: category.guild.roles.everyone,
                            deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                        }
                    ]
                });


                //send a close embed to the channel
                const embed2 = new EmbedBuilder()
                    .setTitle("Match options")
                    .setDescription(`**Game:** ${game}\n**Platform:** ${platform}\n**Region:** ${region}\n**Age:** ${age}\n**Language:** ${language}\n**Description:** ${description}\n\n**Joined by:** ${button.user.tag}`)
                    .setFooter(
                        { text: `Requested by ${interaction.user.tag} | Done`, iconURL: client.user.displayAvatarURL({ dynamic: true }) }
                    )
                    .setTimestamp();
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Close")
                            .setStyle("Danger")
                            .setCustomId("close")
                    //add an button for a voice channel with the name VC and the id of the user like this: VC-userid
                    //in category 1056733178066378795
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Voice channel")
                            .setStyle("Primary")
                            .setCustomId("voice")
                    );

                channel.send({ embeds: [embed2], components: [row2] });

                //create a collector for the close button
                const filter2 = (button) => button.user.id === interaction.user.id;
                const collector2 = channel.createMessageComponentCollector({ filter2, time: 60000 });
                collector2.on("collect", async (button) => {
                    if (button.customId === "close") {
                        button.deferUpdate();
                        channel.delete();
                        //edit the message in the channel 1056720445396754503
                        const channel2 = await client.channels.fetch("1056720445396754503");
                        const msg2 = await channel2.messages.fetch(msg.id);
                        const embed3 = new EmbedBuilder()
                            .setTitle("Find a match")
                            .setDescription(`**Game:** ${game}\n**Platform:** ${platform}\n**Region:** ${region}\n**Age:** ${age}\n**Language:** ${language}\n**Description:** ${description}\n\n**Joined by:** ${button.user.tag}\n\n**Match closed by:** ${button.user.tag}`)
                            .setFooter(
                                { text: `Requested by ${interaction.user.tag} | Done`, iconURL: client.user.displayAvatarURL({ dynamic: true }) }
                            )
                            .setTimestamp();
                        msg2.edit({ embeds: [embed3] });
                    }
                    if (button.customId === "voice") {
                        button.deferUpdate();
                        const category = await client.channels.fetch("1056733178066378795");
                        const channel = await category.guild.channels.create({
                            name: `VC-${button.user.id}`,
                            type: ChannelType.GuildVoice,
                            parent: category,
                            permissionOverwrites: [
                                {
                                    id: button.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
                                },
                                {
                                    id: category.guild.roles.everyone,
                                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
                                }
                            ]
                        });
                    }
                });
            }
        });
    }
};