const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const fetch = require('node-fetch')
//axios
const axios = require('axios')
//get url from .env
const API = process.env.API
const CreditScore = require('../../plugins/schemas/credits.js');

module.exports = {
    name: ["ai","generator"],
    description: "Generate a random image",
    categories: "Ai",
    premium: false,
    options: [
        {
            // Input string for generator
            name: "input",
            description: "Type your input here",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            // Steps for generator
            name: "steps",
            description: "How many steps do you want to generate?",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
        {
            name: "cfg_scale",
            description: "The CFG scale adjusts how much the image looks closer to the prompt and/ or input image.",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
        {
            name: "width",
            description: "The width of the image, from 1 to 1024.",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
        {
            name: "height",
            description: "The height of the image, from 1 to 1024.",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
        {
            name: "seed",
            description: "The seed for the random number generator.",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
        {
            name: "negative_prompt",
            description: "If you want to use a negative prompt, type it here.",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    run: async (interaction, client, language) => {
        const enabled = false;
        if(enabled == false) {
            const embed = new EmbedBuilder()
            .setTitle("This command is disabled")
            .setDescription(`❗This command is currently disabled. Sorry for the inconvenience.❗️`)
            .addFields(
                {
                    name: "Why is it disabled?",
                    value: "This command is disabled because it is not finished or deprecated. ❌",
                    inline: false
                },
                {
                    name: "When will it be finished?",
                    value: "I don't know, maybe never. 🤷‍♂️",
                    inline: false
                },
                {
                    name: "Can I help?",
                    value: "No, you can't. 🙅‍♂️ It's being worked on by our team. 🛠️",
                    inline: false
                },
                {
                    name: "Is there a replacement?",
                    value: "Maybe, use the help command to see all commands. 🤔 Or try our website for more information. 🌐",
                    inline: false
                }
            )
            .setColor("#FF0000");
            return await interaction.reply({ embeds: [embed] });
        }
        // <-> Credit system <-> //
        //get the user id
        const userid = interaction.user.id;
        //search for the user in the database
        const user = await CreditScore.findOne({ userid: userid });
        //if the user is not in the database
        if (!user) {
            const refreshdate = Date.now() + 86400000;
            const newUser = new CreditScore({
                userid: userid,
                tokens: 4,
                refreshdate: refreshdate,
                refreshamount: 5
            });
            //save the user to the database
            await newUser.save();
        }
        else {
            if(user.tokens <= 0) {
                //set tokens to 0
                user.tokens = 0;
                user.save();
            }
        }

        const refreshdate = user.refreshdate;
        //to hours:min:sec
        const timeleft = new Date(refreshdate - Date.now()).toISOString().substr(11, 8);
        if (user.tokens <= 0) {
            const embed = new EmbedBuilder()
                .setTitle("You don't have enough credits")
                .setDescription(`You need 1 credit to use this command, over ` + timeleft + ` you will get 5 credits`) 
                .setColor(client.color)
            
            return await interaction.reply({ embeds: [embed] });
        }

        // <-> Credit system <-> //

        // <-> API <-> //
        if (user.tokens >= 1) {
            user.tokens = user.tokens - 1;
            await user.save();
        const embed = new EmbedBuilder()
            .setTitle("Generating...")
            .setDescription(`Used 1 credit`)
            .setColor(client.color)
        await interaction.reply({ embeds: [embed] }); 
        }
        const collector = interaction.channel.createMessageCollector({
            filter: (m) => m.author.id === interaction.user.id,
            time: 10000,
        });
        collector.on('end', (collected) => {
        });

        prompt = interaction.options.getString('input')
        steps2 = interaction.options.getInteger('steps')
        width = interaction.options.getInteger('width')
        height = interaction.options.getInteger('height')
        seed = interaction.options.getInteger('seed')
        cfg_scale = interaction.options.getInteger('cfg_scale')
        negative_prompt = interaction.options.getString('negative_prompt')
        if (steps2 == null) {
            steps2 = 20
        }
        if (steps2 > 150) {
            steps2 = 150
        }
        if (width == null) {
            width = 512
        }
        if (height == null) {
            height = 512
        }
        if (seed == null) {
            seed = -1
        }
        if (cfg_scale == null) {
            cfg_scale = 7
        }
        if(width > 1024 ) {
            width = 512
        }
        if(height > 1024) {
            height = 512
        }
        if(width < 1) {
            width = 512
        }
        if(height < 1) {
            height = 512
        }
        if (cfg_scale > 30) {
            cfg_scale = 7
        }
        if (cfg_scale < 1) {
            cfg_scale = 7
        }


        let data = JSON.stringify({
            "prompt": prompt,
            "steps": steps2,
            "width": width,
            "height": height,
            "seed": seed,
            "cfg_scale": cfg_scale,
            "negative_prompt": negative_prompt

        });            
        
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: API + '/sdapi/v1/txt2img',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios.request(config)
          .then((response) => {
              let image = response.data.images[0];
              let buffer = Buffer.from(image, 'base64');
          
            // Create buttons
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('generate')
                        .setLabel('Generate')
                        .setStyle('Success')
                        .setEmoji('🔄')
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('save')
                        .setLabel('Save')
                        .setStyle('Primary')
                        .setEmoji('💾')
                )
                .addComponents(
                    new ButtonBuilder()
                        //upscale
                        .setCustomId('upscale')
                        .setLabel('Upscale')
                        .setStyle('Primary')
                        .setEmoji('🔎')
                )
            const embed = new EmbedBuilder()
                .setTitle("Generated image")
                .setDescription(`**Input:** ${prompt}`)
                .setImage("attachment://image.png")
                .setColor(client.color)
                .setFooter({ text: `Steps: ${steps2} | Width: ${width} | Height: ${height} | Seed: ${seed}]` })
                .setTimestamp()

              interaction.editReply({ embeds: [embed], files: [{ attachment: buffer, name: "image.png" }], components: [row] });
          
          })
          .catch((error) => {
            console.log(error);
        });

        const GENERATE_BUTTON = 'generate';
        const SAVE_BUTTON = 'save';
        const UPSCALE_BUTTON = 'upscale';
        
        const filter = (interaction) => {
            return interaction.user.id === userid;
        };

        const collector2 = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector2.on('collect', async (interaction) => {
            if (interaction.customId === GENERATE_BUTTON) {
                interaction.deferUpdate();
                let data = JSON.stringify({
                    "prompt": prompt,
                    "steps": steps2,
                    "width": width,
                    "height": height,
                    "seed": seed,
                    "cfg_scale": cfg_scale,
                    "negative_prompt": negative_prompt
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: API + '/sdapi/v1/txt2img',
                    headers: { 
                      'Content-Type': 'application/json'
                    },
                    data : data
                };

                axios.request(config)
                .then((response) => {
                    let image = response.data.images[0];
                    let buffer = Buffer.from(image, 'base64');

                    const embed = new EmbedBuilder()
                        .setTitle("Generated image")
                        .setDescription(`**Input:** ${prompt}`)
                        .setImage("attachment://image.png")
                        .setColor(client.color)
                        .setFooter({ text: `Steps: ${steps2} | Width: ${width} | Height: ${height} | Seed: ${seed}]` })
                        .setTimestamp()

                    interaction.editReply({ embeds: [embed], files: [{ attachment: buffer, name: "image.png" }], components: [row] });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            if (interaction.customId === SAVE_BUTTON) {
                interaction.deferUpdate();
                interaction.followUp({
                    content: 'Here is the direct download link:',
                    files: [{ attachment: buffer, name: "image.png" }]
                  });
            }
            if (interaction.customId === UPSCALE_BUTTON) {
                //needs to be done
            }
        });
        // <-> API <-> //
    }
}
