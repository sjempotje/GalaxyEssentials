const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const Polls = require("../../plugins/schemas/polls.js")

module.exports = {
    name: ["moderation", "poll"],
    description: "Create a poll",
    categories: "Moderation",
    premium: false,
    options: [
        {
            name: "question",
            description: "The question you want to ask",
            type: 3,
            required: true
        },
        {
            name: "option1",
            description: "The first option",
            type: 3,
            required: false
        },
        {
            name: "option2",
            description: "The second option",
            type: 3,
            required: false
        },
        {
            name: "option3",
            description: "The third option",
            type: 3,
            required: false
        },
        {
            name: "option4",
            description: "The fourth option",
            type: 3,
            required: false
        },
        {
            name: "option5",
            description: "The fifth option",
            type: 3,
            required: false
        },
        {
            name: "option6",
            description: "The sixth option",
            type: 3,
            required: false
        },
        {
            name: "option7",
            description: "The seventh option",
            type: 3,
            required: false
        },
        {
            name: "option8",
            description: "The eighth option",
            type: 3,
            required: false
        },
        {
            name: "option9",
            description: "The ninth option",
            type: 3,
            required: false
        },
        {
            name: "option10",
            description: "The tenth option",
            type: 3,
            required: false
        }
    ],
    run: async (interaction, client, language) => {
        //poll sampledata
        // const sampleData = {
        //     guildID: interaction.guild.id,
        //     channelID: "123456789",
        //     messageID: "123456789",
        //     question: "What is your favorite color?",
        //     options: ["Red", "Blue", "Green"],
        //     votes: [0, 0, 0],
        //     voters: [[], [], []],
        //     time: 10000,
        //     isEnded: false,
        //     endedReason: null,
        //     endedTime: null
        // }
        //create the poll
        let question = interaction.options.getString("question");
        //check if options are provided using a loop
        let options = [];
        for (let i = 1; i <= 10; i++) {
            let option = interaction.options.getString("option" + i);
            if (option) options.push(option);
        }
        //check if there are no given options use :thumbsup: and :thumbsdown:
        if (options.length == 0) options = [":thumbsup:", ":thumbsdown:"];
        //check if there are more than 10 options
        if (options.length > 10) return interaction.reply({ content: "You can only have 10 options", ephemeral: true });
        //create the poll
        let poll = {
            guildID: interaction.guild.id,
            channelID: interaction.channel.id,
            question: question,
            options: options,
            votes: [],
            voters: [],
            time: 10000,
            isEnded: false,
            endedReason: null,
            endedTime: null
        }
        //create the votes and voters array
        for (let i = 0; i < options.length; i++) {
            poll.votes.push(0);
            poll.voters.push([]);
        }
        //save the poll
        await Polls.create(poll);
        //create the embed
        let embed = new EmbedBuilder()
            .setTitle("Poll")
            .setDescription(question)
            //set to a green color
            .setColor("GREEN")
            //set the footer
            .setFooter("Poll created by " + interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
            //set the timestamp
            .setTimestamp();
        //create the action row
        let actionRow = new ActionRowBuilder();
        //create the buttons
        for (let i = 0; i < options.length; i++) {
            actionRow.addComponent(new ButtonBuilder().setLabel(options[i]).setCustomId("poll_" + i).setStyle("PRIMARY"));
        }
        //send the message
        let msg = await interaction.reply({ embeds: [embed], components: [actionRow], fetchReply: true });
        //update the poll
        await Polls.findOneAndUpdate
            (
                { guildID: interaction.guild.id, channelID: interaction.channel.id, messageID: null },
                { messageID: msg.id }
            );
    }
};

