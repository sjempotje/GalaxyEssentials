const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
module.exports = {
  name: ["link"],
  description: "Links your Discord account to your Magister account",
  categories: "Admin",
  options: [
      {
          name: "magisterid",
          description: "Your Magister ID",
          type: 3,
          required: true
      }
  ],
  run: async (interaction, client, language) => {
      const fs = require('fs');
      const path = require('path');
      userid = interaction.user.id;
      magisterid = interaction.options.getString("magisterid");
      //juse path to the json file
        const jsonPath = path.join(__dirname, '../../plugins/modules/magister/link.json');
        //read the json file
        fs.readFile(jsonPath, 'utf8', function readFileCallback(err, data) {
            //if there is an error throw it
            if (err) {
                console.log(err);
            } else {
                //parse the json file
                obj = JSON.parse(data);
                //add the new value to the json file
                obj[userid] = magisterid;
                //stringify the json file
                json = JSON.stringify(obj);
                //write the json file
                fs.writeFile(jsonPath, json, 'utf8', function (err) {
                    //if there is an error throw it
                    if (err) {
                        console.log(err);
                    } else {
                        //send a message to the user
                        interaction.reply("Succesfully linked your Discord account to your Magister account");
                    }
                });
            }
        });
    }
}