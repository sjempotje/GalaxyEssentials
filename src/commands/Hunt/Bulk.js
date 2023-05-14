const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const mcapi = require("minecraft-lookup");
//lib to request data from api
//import config
const { HUNT_ID } = require('../../plugins/config.js');

//import database
const Hunt = require('../../plugins/schemas/hunt.js');

module.exports = {
    name: ["hunt", "bulk"],
    description: "Add a list of users to the hunt list.",
    categories: "Hunt",
    options: [
        {
            name: "minecraftusernames",
            description: "Usernames of the users you want to add to the hunt list. Use commas to separate usernames.",
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
        const minecraftusernames = interaction.options.getString("minecraftusernames");
        //check the usernames and split them into an array
        const usernames = minecraftusernames.split(",");
        //remove any spaces in the usernames
        for (let i = 0; i < usernames.length; i++) {
            usernames[i] = usernames[i].trim();
        }

        const normalArray = [];
        await interaction.reply("Trying to add " + usernames.length + " users to the hunt list.");

        let replytext = "";

        for (let i = 0; i < usernames.length; i++) {
            const id = await mcapi.user(usernames[i]);
            const uuid = convertToFullUUID(id.id);
            //check if uuid is null
            if (uuid == null) {
                interaction.reply("Invalid username." + usernames[i]);
                return;
            }
            else {
                //add username to reply text if it is valid
                replytext = replytext + usernames[i] + ",e\n";
                //add username to array if it is valid
                normalArray.push(usernames[i]);

            }
        }
        console.log(normalArray);
        //edit the reply to include the valid usernames
        await interaction.editReply("The following users have been added to the hunt list: \n" + replytext);


        const status = interaction.options.getBoolean("status");
        const discordusername = interaction.options.getString("discordusername");
        const permfocus = interaction.options.getBoolean("permfocus");
        const focustime = interaction.options.getInteger("focustime");
        let discordusername2;
        let permfocus2;
        let focustime2;


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

        // function addToDatabase( minecraftusername, id, discordusername, permfocus, focustime, status) {
        //     const newHunt = new Hunt({
        //         username: minecraftusername,
        //         uuid: id,
        //         discordid: discordusername,
        //         permfocus: permfocus,
        //         focustime: focustime,
        //         status: status
        //     });
        //     newHunt.save().then(() => console.log("New user added to hunt list."));
        // }
        // id = await mcapi.user(minecraftusername);
        // if (id) {
        //     const fullUUID = await convertToFullUUID(id.id);
        //     console.log(fullUUID);
        //     console.log("Full UUID: " + fullUUID);
        //     //if fullUUID returns than run this
        //     if (fullUUID) {
        //         const search = await Hunt.findOne({ uuid: fullUUID });
        //         //if search returns than run this
        //         if (search) {
        //             return interaction.reply("This user is already in the hunt list.");
        //         } else {
        //             addToDatabase(minecraftusername, fullUUID, discordusername, permfocus, focustime, status);
        //             console.log("Added " + minecraftusername + " " + fullUUID + " " + discordusername2 + " " + permfocus2 + " " + focustime2 + " " + status);                
        //             const embed = new EmbedBuilder()
        //                 .setTitle("Hunt List")
        //                 .setDescription("A user has been added to the hunt list.")
        //                 .addFields([
        //                     {name: "Minecraft Username", value: "**" + minecraftusername + "**", inline: true},
        //                     {name: "Discord Username", value: "**" + discordusername2 + "**", inline: true},
        //                     {name: "Permanent Focus", value: "**" + permfocus2 + "**", inline: true},
        //                     {name: "Focus Time", value: "**" + focustime2 + "**", inline: true},
        //                     {name: "Being focused at the moment", value: "**" + status + "**", inline: true},

        //                 ])
        //                 .setColor(client.color)
        //                 .setTimestamp()
        //                 .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        //                 //add a image to the embed
        //                 .setThumbnail("https://crafatar.com/renders/body/" + fullUUID + "?overlay&scale=10");
        //             return interaction.reply({ embeds: [embed] });
        //         }
        //         //
        //     } else {
        //         return interaction.reply("The minecraft username you entered is invalid.");
        //     }

        // } else {
        //     return interaction.reply("The minecraft username you entered is invalid.");
        // }
        // //
    }
}