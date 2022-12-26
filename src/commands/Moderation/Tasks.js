const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');

module.exports = {
    name: ["moderation", "tasks"],
    description: "Make a task",
    categories: "Moderation",
    premium: false,
    //to-do: XMAS event,
    // - Object1
    // - Object2
    // - Object3


    // Note: ObjectNotes

    // Deadline: timestamp
    options: [
        {
            name: "users_assigned",
            description: "The users assigned to the task",
            type: 6,
            required: true
        },
        {
            name: "task_notes",
            description: "The notes of the task",
            type: 3,
            required: true
        }, 
        {
            name: "task_name",
            description: "The name of the task",
            type: 3,
            required: true
        },
        {
            name: "deadline_date",
            description: "The date of the deadline",
            type: 3,
            required: true
        },
        {
            name: "deadline_time",
            description: "The time of the deadline in 24h format (e.g. 12:00)",
            type: 3,
            required: true
        },
        {
            name: "task_object_1",
            description: "The first object of the task",
            type: 3,
            required: true
        },
        {
            name: "task_object_2",
            description: "The second object of the task",
            type: 3,
            required: false
        },
        {
            name: "task_object_3",
            description: "The third object of the task",
            type: 3,
            required: false
        },
        {
            name: "task_object_4",
            description: "The fourth object of the task",
            type: 3,
            required: false
        },
        {
            name: "task_object_5",
            description: "The fifth object of the task",
            type: 3,
            required: false
        }
    ],
    permissions: ["MANAGE_MESSAGES"],
    run: async (interaction, client, language) => {
        //get the task name
        let task_name = interaction.options.getString("task name");
        //get task object 1 
        let task_object_1 = interaction.options.getString("task object 1");
        //if there are more objects, get them using a for loop
        let task_object_2 = interaction.options.getString("task object 2");
        let task_object_3 = interaction.options.getString("task object 3");
        let task_object_4 = interaction.options.getString("task object 4");
        let task_object_5 = interaction.options.getString("task object 5");
        //get the deadline date
        let deadline_date = interaction.options.getString("deadline_date");
        //get the deadline time
        let deadline_time = interaction.options.getString("deadline_time");
        //get the task notes
        let task_notes = interaction.options.getString("task_notes");
        //check if task_object_2 until task_object_5 are not empty if they are empty don't add them to the task
        let task_objects = "";
        if (task_object_1) task_objects += "- " + task_object_1 + "\n";
        // if (task_object_2) task_objects += "- " + task_object_2 + "\n";
        // if (task_object_3) task_objects += "- " + task_object_3 + "\n";
        // if (task_object_4) task_objects += "- " + task_object_4 + "\n";
        // if (task_object_5) task_objects += "- " + task_object_5 + "\n";
        //create the embed
        let embed = new EmbedBuilder()
            .setTitle(task_name)
            .addFields(
                {
                    name: "Objects",
                    value: task_object_1
                },
                {
                    name: "Deadline",
                    value: deadline_date + " at " + deadline_time
                },
                {
                    name: "Notes",
                    value: task_notes
                }
            )
            .setFooter("Made by " + interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("RANDOM");
        //create the buttons
        let buttons = new ActionRowBuilder()
            .addComponents( 
                new ButtonBuilder()
                    .setCustomId("task_done")
                    .setLabel("Done")
                    .setStyle("SUCCESS")
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("task_delete")
                    .setLabel("Delete")
                    .setStyle("DANGER")
            );
        //send the message
        interaction.reply({ embeds: [embed], components: [buttons] });

        //create the collector
        let filter = (button) => button.user.id === interaction.user.id;
        let collector = interaction.channel.createMessageComponentCollector({ filter, time: 1000 * 60 * 60 * 24 * 7 });
        collector.on("collect", async (button) => {
            //if the button is the done button
            if (button.customId === "task_done") {
                //edit the embed
                embed.setDescription("This task is done!");
                //edit the buttons
                buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("task_delete")
                            .setLabel("Delete")
                            .setStyle("DANGER")
                    );
                //edit the message
                button.update({ embeds: [embed], components: [buttons] });
            }
            //if the button is the delete button
            if (button.customId === "task_delete") {
                //delete the message
                button.update({ embeds: [], components: [] });
            }
        }
        );

        collector.on("end", async (collected, reason) => {
            //if the reason is time
            if (reason === "time") {
                //edit the embed
                embed.setDescription("This task is expired!");
                //edit the buttons
                buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("task_delete")
                            .setLabel("Delete")
                            .setStyle("DANGER")
                    );
                //edit the message
                interaction.editReply({ embeds: [embed], components: [buttons] });
            }
        }
        );
    }
}
