const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch')
//axios
const axios = require('axios')
//get url from .env
const API = process.env.API

module.exports = {
    name: ["ai", "massgen"],
    description: "Generate a bunch of images",
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
        }
    ],
    run: async (interaction, client, language) => {
        prompt = interaction.options.getString('input')
        //send test embed builder
        const embed = new EmbedBuilder()
            .setTitle("Generating...")  
            .setColor(client.color)
            //send the embed
        await interaction.reply({ embeds: [embed] }); 

        //make an collector to wait for the api to respond
        const collector = interaction.channel.createMessageCollector({
            filter: (m) => m.author.id === interaction.user.id,
            time: 100000,
        });
        //if the api doesn't respond in 10 seconds, send a error message
        collector.on('end', (collected) => {
        });

        steps2 = interaction.options.getInteger('steps')
        if (steps2 == null) {
            steps2 = 20
        }
        //if it is above 150, set it to 150
        if (steps2 > 150) {
            steps2 = 150
        }


        //make the api request
        let data = JSON.stringify({
            "prompt": prompt,
            "steps": steps2,

        });
        
        let options = {
            "sd_model_checkpoint": "GalAI-v1.5-anime",
        };

        let optionsapply = {
            method: 'post',
            maxBodyLength: Infinity,
            url: API + '/sdapi/v1/options',
            headers: {
                'Content-Type': 'application/json'
            },
            data: options
        };
            
        
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: API + '/sdapi/v1/txt2img',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
        };
        allbase64 = []
        for (let i = 0; i < 20; i++) {
            axios.request(config)
            .then((response) => {
                let image = response.data.images[0];
                allbase64.push(image)
                console.log("got image")
                //transform the base64 to a buffer
                let buff = Buffer.from(image, 'base64');
                //send the buffer as a file
                interaction.channel.send({ files: [buff] });
            })
            .catch((error) => {
                console.log(error);
            }
            );
        }
    }
}
