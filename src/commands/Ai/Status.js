const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const axios = require('axios');
//get API url from .env
const API = process.env.API;


module.exports = { 
  name: ["ai", "status"],
  description: "Shows the status of the AI network of nodes",
  categories: "Ai",
  run: async (interaction, client, language) => {
    const { data } = await axios.get(API + '/sdapi/v1/progress?skip_current_image=true');
    const { job_count } = data.state;
    const number = job_count > 0;
    color2 = ""
    if (number) {
      var job2 = ""+job_count;
      color2 = "#ff0000"
    } else {
      var job2 = 'There are no jobs running'
      color2 = "#00ff00"      
    }
    const embed = new EmbedBuilder()
      .setTitle('AI Status')
      .setColor(color2)
      .addFields([
        {
          name: 'Job',
          value: job2,
          inline: true,
        }
      ])
    await interaction.reply({ embeds: [embed] });

    const interval = setInterval(async () => {
      const { data } = await axios.get(API + '/sdapi/v1/progress?skip_current_image=true');
      const { job_count } = data.state;
      const number = job_count > 0;
      color2 = ""
      if (number) {
        var job2 = ""+job_count;
        color2 = "#ff0000"
      } else {
        var job2 = 'There are no jobs running e'
        color2 = "#00ff00"      
      }
      const embed = new EmbedBuilder()
        .setTitle('AI Status')
        .setColor(color2)
        .addFields([
          {
            name: 'Job',
            value: job2,
            inline: true,
          }
        ])
      await interaction.editReply({ embeds: [embed] });
    }
    , 5000);
    setTimeout(() => {
      clearInterval(interval);
    }
    , 120000);
  }
}