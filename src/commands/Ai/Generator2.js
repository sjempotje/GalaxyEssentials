const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const fetch = require('node-fetch')
//axios
const axios = require('axios')
//get url from .env
const API = process.env.API
const CreditScore = require('../../plugins/schemas/credits.js');

module.exports = {
    name: ["ai","generator2"],
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
        // {
        //     name: "width",
        //     description: "The width of the image, from 1 to 1024.",
        //     type: ApplicationCommandOptionType.Integer,
        //     required: false,
        // },
        // {
        //     name: "height",
        //     description: "The height of the image, from 1 to 1024.",
        //     type: ApplicationCommandOptionType.Integer,
        //     required: false,
        // },
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
        // <-> Input <-> //
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
        // if(width > 1024 ) {
        //     width = 512
        // }
        // if(height > 1024) {
        //     height = 512
        // }
        // if(width < 1) {
        //     width = 512
        // }
        // if(height < 1) {
        //     height = 512
        // }
        if (cfg_scale > 30) {
            cfg_scale = 7
        }
        if (cfg_scale < 1) {
            cfg_scale = 7
        }

        const embed = new EmbedBuilder()
        .setTitle("🚀 BETA testing GalaxyAI 🤖")
        .setDescription("Please choose an image size:")
        .addFields(
            { name: ":small_blue_diamond: Small", value: "Choose `small` to choose a small image. 256x265" },
            { name: ":small_blue_diamond: Small wide", value: "Choose `small wide` to choose a small wide image. 512x256" },
            { name: ":small_orange_diamond: Medium", value: "Choose `medium` to choose a medium image. 512x512" },
            { name: ":small_orange_diamond: Medium wide", value: "Choose `medium wide` to choose a medium wide image. 1024x512" },
            { name: ":small_red_triangle: Large", value: "Choose `large` to choose a large image. 1024x1024" },
        );

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('small')
                .setLabel('Small')
                .setEmoji({ name: "🐦" })
                .setStyle('Primary'),
            new ButtonBuilder()
                .setCustomId('small wide')
                .setLabel('Small wide')
                .setEmoji({ name: "🌅" })
                .setStyle('Primary'),
            new ButtonBuilder()
                .setCustomId('medium')
                .setLabel('Medium')
                .setEmoji({ name: "🌺" })
                .setStyle('Primary'),
            new ButtonBuilder()
                .setCustomId('medium wide')
                .setLabel('Medium wide')
                .setEmoji({ name: "🌄" })
                .setStyle('Primary'),
            new ButtonBuilder()
                .setCustomId('large')
                .setLabel('Large')
                .setEmoji({ name: "🏞️" })
                .setStyle('Primary'),
        );

        const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
        const filter = i => i.customId === 'small' || i.customId === 'medium' || i.customId === 'large' || i.customId === 'small wide' || i.customId === 'medium wide' || i.customId === 'large wide';
        const collector = msg.createMessageComponentCollector({ filter, time: 15000 });
        
        let cost = 0;

        let sizeChoice = await new Promise(async (resolve) => {
            collector.on('collect', async i => {
                if (i.customId === 'small') {
                    width = 256
                    height = 256
                    cost = 1
                    await i.update({ embeds: [embed] });
                    resolve(true);
                } else if (i.customId === 'medium') {
                    width = 512
                    height = 512
                    cost = 2
                    await i.update({ embeds: [embed] });
                    resolve(true);
                } else if (i.customId === 'large') {
                    width = 1024
                    height = 1024
                    cost = 3
                    await i.update({ embeds: [embed] });
                    resolve(true);
                }
                else if (i.customId === 'small wide') {
                    width = 512
                    height = 256
                    cost = 2
                    await i.update({ embeds: [embed] });
                    resolve(true);
                }
                else if (i.customId === 'medium wide') {
                    width = 1024
                    height = 512
                    cost = 3
                    await i.update({ embeds: [embed] });
                    resolve(true);
                }
                else if (i.customId === 'large wide') {
                    width = 1536
                    height = 1024
                    cost = 5
                    await i.update({ embeds: [embed] });
                    resolve(true);
                }
            });
            collector.on('end', collected => {
                console.log(`Collected ${collected.size} items`);
                resolve(false);
            });
        });

            

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
        // <-> Input <-> //

        // <-> Status of the API <-> //
        let isOnline = true;
        const response = await axios.get(API, { timeout: 1000 });
        // <-> Status of the API <-> //
        
        if(isOnline == true) {
            if(sizeChoice == true) {       
            // <-> Credit system <-> //
            const userid = interaction.user.id;
            const user = await CreditScore.findOne({ userid: userid });
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
                
                return await interaction.editReply({ embeds: [embed] });
            }

            // <-> Credit system <-> //

            // <-> API <-> //
            if (user.tokens >= 1) {
                user.tokens = user.tokens - cost;
                console.log(cost);
                await user.save();
                const embed = new EmbedBuilder()
                    .setTitle("🚀 BETA testing GalaxyAI 🤖")
                    .setDescription("🆕 Version 6.0.0 🆙\n🔥 Generating... 🔥\n🤖 Used 1 credit 💰")
                    .setColor(client.color)
                    .addFields(
                        { name: "API Status", value: "🟢 Online" }
                    );
                await interaction.editReply({ embeds: [embed] });
                //use function
                generate();
            }
            const collector = interaction.channel.createMessageCollector({
                filter: (m) => m.author.id === interaction.user.id,
                time: 100000,
            });

            async function generate() {
            axios.request(config)
            .then((response) => {
                let image = response.data.images[0];
                let buffer = Buffer.from(image, 'base64');
            
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
                    .setTitle("🎨 Generated Image")
                    .setDescription(`**Prompt:** ${prompt}`)
                    .setImage("attachment://image.png")
                    .setColor("#FFC107")
                    .addFields(
                        { name: 'Settings', value: `📏 Width: ${width} | 📐 Height: ${height} | 🔢 Steps: ${steps2} | 🌱 Seed: ${seed}` },
                    )
                    .setFooter({ text: "👀 Thanks for using our service!"})
                    .setTimestamp();

                interaction.editReply({ embeds: [embed], files: [{ attachment: buffer, name: "image.png" }], components: [row] });
                
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            const GENERATE_BUTTON = 'generate';
            const SAVE_BUTTON = 'save';
            const UPSCALE_BUTTON = 'upscale';
            
            const filter = (interaction) => {
                return interaction.user.id === userid;
            };

            async function regenerate() {
                // <-> API <-> //
                
            }
            //it can only be used 5 times
            const collector2 = interaction.channel.createMessageComponentCollector({ filter, time: 600000});

            collector2.on('collect', async (interaction) => {
                let allbuffer = 0;

                if (interaction.customId === GENERATE_BUTTON) {
                    //remove 1 credit
                    if (user.tokens <= 0) {
                        const embed = new EmbedBuilder()
                            .setTitle("You don't have enough credits")
                            .setDescription(`You need 1 credit to use this command, over ` + timeleft + ` you will get 5 credits`) 
                            .setColor(client.color)
                        
                        return await interaction.reply({ embeds: [embed], ephemeral: true });
                    }
                    user.tokens = user.tokens - cost;

                    await user.save();
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
                        allbuffer = Buffer.from(image, 'base64');
                        let buffer = Buffer.from(image, 'base64');

                        const embed = new EmbedBuilder()
                            .setTitle("🎨 Generated Image")
                            .setDescription(`**Prompt:** ${prompt}`)
                            .setImage("attachment://image.png")
                            .setColor("#FFC107")
                            .addFields(
                                { name: 'Settings', value: `📏 Width: ${width} | 📐 Height: ${height} | 🔢 Steps: ${steps2} | 🌱 Seed: ${seed}` },
                            )
                            .setFooter({ text: "👀 Thanks for using our service!"})
                            .setTimestamp();            

                        interaction.editReply({ embeds: [embed], files: [{ attachment: buffer, name: "image.png" }] });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                }
                if (interaction.customId === SAVE_BUTTON) {
                    interaction.deferUpdate();
                    //get embed image and get the url
                    const embed2 = interaction.message.embeds[0];
                    const url = embed2.image?.url;
                    //report the url
                    const embed = new EmbedBuilder()
                        .setTitle("📷 Image saved!")
                        .setDescription(`👉 [Click here to download the image](${url})`)
                        .setImage(url)
                        .setColor("#FFA500")
                        .setFooter({ text: "👀 Thanks for using our service!"})
                        .setTimestamp();
                    //make a new message in that channel and delete it after 15 seconds
                    interaction.channel.send({ embeds: [embed] }).then(msg => {
                        setTimeout(() => msg.delete(), 15000)
                    }
                    )
                }
                if (interaction.customId === UPSCALE_BUTTON) {
                    //needs to be done
                }
            });
        }
    }
    else {
        console.log("API is offline");
        const embed = new EmbedBuilder()
            .setTitle("🔴 The API is currently offline")
            .setDescription(`The API is currently offline, please try again later`)
            .setColor(client.color)
        await interaction.editReply({ embeds: [embed], ephemeral: true });
    }


        //if the collector times is over
        // collector2.on('end', collected => {
        //     //reply to the user
        //     const embed = new EmbedBuilder()
        //         .setTitle("The command has timed out")
        //         .setDescription(`You can only use this command 5 times per minute`)
        //         .setColor(client.color)
        //     interaction.editReply({ embeds: [embed], ephemeral: true });
        // });


        // <-> API <-> //
    }
}
