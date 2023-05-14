const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const { OPENAI } = require("../../plugins/config.js")

//this command needs work, it doesn't work yet

module.exports = {
    name: ["generate"],
    description: "Generates text with the OpenAI API",
    categories: "Moderation",
    premium: false,
    options: [
        {
            name: "text",
            description: "The text you want to generate",
            type: 3,
            required: true
        }
    ],
    permissions: ["MANAGE_GUILD"],
    run: async (interaction, client, language) => {
        // const key = OPENAI;

        // const configuration = new Configuration({
        // apiKey: key,
        // });
        // const openai = new OpenAIApi(configuration);

        // const response = openai.createCompletion({
        // model: "code-davinci-002",
        // prompt: interaction.options.getString("text"),
        // temperature: 0,
        // max_tokens: 256
        // });

        // //log the text of the response when it is done
        // response.then(function(response) {
        // console.log(response.data.choices[0].text);
        // });
        // //when the above function is done, send the response
        // response.then(function(response) {
        // interaction.reply({ content: response.data.choices[0].text })
        // });

        interaction.reply("Hey, sorry but this command is deprecated.")
    }
};
