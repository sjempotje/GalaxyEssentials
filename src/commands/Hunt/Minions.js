const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const mcapi = require("minecraft-lookup");
//import config
const { HUNT_ID } = require('../../plugins/config.js');

//import database
const Hunt = require('../../plugins/schemas/hunt.js');
const fieldarray = [];

module.exports = {
    name: ["hunt", "minions"],
    description: "Display the minions that are currently helping you.",
    categories: "Hunt",
    run: async (interaction, client, language) => {
        //get everyone who is currently being hunted
        const hunt = await Hunt.find({ status: false });
        console.log(hunt);
        await interaction.reply("Getting information...");
        //temp timeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        for (let i = 0; i < hunt.length; i++) {
            const embed = new EmbedBuilder()
                .setTitle("Minions")
                .setColor("#00ff00")
                .setDescription("Here are the minions that are currently helping you.")
                .setFooter({ text: "Minions", iconURL: client.user.avatarURL() })
                .setTimestamp();
            //get the minecraft username
            const minecraftusername = hunt[i].username;
            //get the discord id
            const discordid = hunt[i].discordid;
            //get the discord user but if it is null then set it to none
            if(discordid != null) var discorduser = await client.users.fetch(discordid);
            else{
                //return None if the discord id is null
                var discorduser = "None";
            }
            var discordusername = discorduser.username;
            //get the uuid
            const uuid = hunt[i].uuid;
            //get the player skin
            const skin = await mcapi.head(uuid);
            console.log(skin);
            //get the player head
            const head = skin.helmhead;
            //check values if they are null
            if (minecraftusername == null) minecraftusername = "None";
            if (discordusername == null) discordusername = "None";
            if (uuid == null) uuid = "None";
            if (head == null) head = "None";
            //add the field to the embed
            await embed.addFields({ name: "Minecraft Username", value: minecraftusername, inline: true });
            //add the image to the embed
            await embed.setImage(head);
            //send a new embed for each user
            await interaction.channel.send({ embeds: [embed] });
        }
    }
}