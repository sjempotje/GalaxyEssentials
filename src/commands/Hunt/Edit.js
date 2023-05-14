const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const mcapi = require("minecraft-lookup");
//import config
const { HUNT_ID } = require('../../plugins/config.js');

//import database
const Hunt = require('../../plugins/schemas/hunt.js');

module.exports = {
    name: ["hunt", "edit"],
    description: "Edit a user on the hunt list.",
    categories: "Hunt",
    options: [
        {
            name: "minecraftusername",
            description: "The user you want to add to the hunt list.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "status",
            description: "Whether or not the user is currently being hunted. False means they are not being hunted.",
            type: ApplicationCommandOptionType.Boolean,
            required: true
        },
        {
            name: "shopper",
            description: "Whether or not the user is a shopper.",
            type: ApplicationCommandOptionType.Boolean,
            required: true
        },
        {
            name: "discordusername",
            description: "The discord user name associated with the minecraft user.",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "permfocus",
            description: "Whether or not the user has permanent focus.",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        },
        {
            name: "focustime",
            description: "The amount of time in hours the user has focus.",
            type: ApplicationCommandOptionType.Integer,
            required: false
        },
    ],
    run: async (interaction, client, language) => {
        if (!HUNT_ID.includes(interaction.user.id)) return interaction.reply("You do not have permission to use this command.");
        const minecraftusername = interaction.options.getString("minecraftusername");
        const status = interaction.options.getBoolean("status");
        const discordusername = interaction.options.getString("discordusername");
        const permfocus = interaction.options.getBoolean("permfocus");
        const focustime = interaction.options.getInteger("focustime");
        const shopper = interaction.options.getBoolean("shopper");

        if (discordusername == null) {
            discordusername2 = "Not Provided";
        } else {
            discordusername2 = discordusername;
        }
        if (permfocus == null) {
            permfocus2 = false;
        } else {
            permfocus2 = permfocus;
        }
        if (focustime == null) {
            focustime2 = 0;
        } else {
            focustime2 = focustime;
        }

        function convertToFullUUID(id) {
            const UUID_PATTERN = /^[0-9a-fA-F]{32}$/;
            if (!UUID_PATTERN.test(id)) {
              return null; // invalid input
            }
            const segments = [
              id.substr(0, 8),
              id.substr(8, 4),
              id.substr(12, 4),
              id.substr(16, 4),
              id.substr(20)
            ];
            return `${segments[0]}-${segments[1]}-${segments[2]}-${segments[3]}-${segments[4]}`;
        }
        function editToDatabase( minecraftusername, id, discordusername, permfocus, focustime, status, shopper) {
            //search id in database and update
            Hunt.findOneAndUpdate({ uuid: id }, {
                username: minecraftusername,
                uuid: id,
                discordid: discordusername,
                permfocus: permfocus,
                focustime: focustime,
                status: status,
                shopper: shopper
            }, { upsert: true }, function (err, doc) {
                if (err) return console.log(err);
            });
        }

        id = await mcapi.user(minecraftusername).then(id => id.id ).catch(error => error);
        if (id) {
            const fullUUID = convertToFullUUID(id);
            if (fullUUID) {
                const search = await Hunt.findOne({ uuid: fullUUID });
                if (search) {
                    editToDatabase(minecraftusername, fullUUID, discordusername, permfocus, focustime, status, shopper);
                    console.log("User edited in database.");
                    const embed = new EmbedBuilder(client)
                        .setTitle("Hunt List")
                        .setDescription("A user has been added to the hunt list.")
                        .addFields([
                            {name: "Minecraft Username", value: "**" + minecraftusername + "**", inline: true},
                            {name: "Discord Username", value: "**" + discordusername2 + "**", inline: true},
                            {name: "Permanent Focus", value: "**" + permfocus2 + "**", inline: true},
                            {name: "Focus Time", value: "**" + focustime2 + "**", inline: true},
                            {name: "Being focused at the moment", value: "**" + status + "**", inline: true},
                            {name: "Shopper", value: "**" + shopper + "**", inline: true},

                        ])
                        .setColor(client.color)
                        .setTimestamp()
                        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        //add a image to the embed
                        .setThumbnail("https://crafatar.com/renders/body/" + fullUUID + "?overlay&scale=10");
                    return await interaction.reply({ embeds: [embed] });
                }
                //if search does not return than run this
                else {
                    return interaction.reply("The minecraft username you entered is not on the hunt list, please use /hunt add.");
                }
                //
            } else {
                return interaction.reply("The minecraft username you entered is invalid.");
            }

        } else {
            return interaction.reply("The minecraft username you entered is invalid.");
        }
    }
}