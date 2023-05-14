const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const fs = require("fs").promises;
//import import {createWriteStream} from 'fs'
const path = require('path');

module.exports = async (client) => {
    client.logger.info("Magister enabled. Starting callings...")
    //import link.json from /modules/magister
    const jsonPath = path.join(__dirname, '../plugins/modules/magister/link.json');
    let fileData = ""; //initialize empty string
    const sendPath = path.join(__dirname, '../plugins/modules/magister/send.json');
    const tempPath = path.join(__dirname, '../plugins/modules/magister/temp.json');
    let sendFileData = "";
    //make a boolean to check if we are in testing mode
    const testingmode = true;

    //make a loop every 5 minutes that returns the data from the json file
    setInterval(async () => {
        try {
            fileData = await fs.readFile(jsonPath, 'utf8');
            sendFileData = await fs.readFile(sendPath, 'utf8');

            //for each user in the json file {"331433556867940353":"110579"}
            for (const [key, value] of Object.entries(JSON.parse(fileData))) {
                for (const [key2, value2] of Object.entries(JSON.parse(sendFileData))) {
                    if (key2 == key) {
                        const axios = require('axios');
                        const response = "";
                        if(testingmode == true) {                
                            const response = await fs.readFile(tempPath, 'utf8');
                            //close the file
                            // client.logger.info("Succesfully fetched data from Temp API");
                            // client.logger.info(response);
                            return response;
                        
                        }
                        if(testingmode == false) {
                            const response = await axios.get(`http://0.0.0.0:5000/api/v1/appointments/${value}`);
                            client.logger.info("Succesfully fetched data from Magister API");
                            return response;
                        }
                        client.logger.info(response);
                        if (response.error) {
                            console.log(response.error);
                        }
                        //get user from discord id
                        const user = await client.users.fetch(key);
                        //get private channel with user
                        const channel = await user.createDM();
                        //get message from channel
                        const message = await channel.messages.fetch(value2);

                        const embed = {
                            title: "Magister",
                            description: "Here are your appointments for today",
                            color: 0x00ff00,
                            fields: response.data.map(appointment => {
                                const start = new Date(appointment.start * 1000).toLocaleTimeString();
                                const end = new Date(appointment.end * 1000).toLocaleTimeString();
                                return {
                                    name: `${appointment.startTimeSlotName} - ${appointment.endTimeSlotName}`,
                                    value: `**Subject:** ${appointment.subjects.join(', ')}\n**Teacher:** ${appointment.teachers.join(', ')}\n**Location:** ${appointment.locations.join(', ')}\n**Time:** ${start} - ${end}`,
                                    inline: false
                                };
                            })
                        }
                        message.edit({ embeds: [embed] });
                    }
                        
                }
                //if there isn't an entry in the json file for the user
                if (!sendFileData.includes(key)) {
                    const axios = require('axios');
                    const response = await axios.get(`http://0.0.0.0:5000/api/v1/appointments/${value}`);
                    //if there is an error throw it
                    if (response.error) {
                        console.log(response.error);
                    }
                    //if there is no error
                    else {
        
                        //use the data from the api
                        let fileData = "";
                        fileData = JSON.stringify(response.data);
                        
        
        
                        //create a private message to the user
                        const user = await client.users.fetch(key);
                        const channel = await user.createDM();
        
                        //sort the appointments by start time
                        const appointments = JSON.parse(fileData).sort((a, b) => a.start - b.start);
                        const embed = {
                            title: "Magister",
                            description: "Here are your appointments for today",
                            fields: appointments.map(appointment => {
                                const start = new Date(appointment.start * 1000).toLocaleTimeString();
                                const end = new Date(appointment.end * 1000).toLocaleTimeString();
                                return {
                                    name: `${appointment.startTimeSlotName} - ${appointment.endTimeSlotName}`,
                                    value: `**Subject:** ${appointment.subjects.join(', ')}\n**Teacher:** ${appointment.teachers.join(', ')}\n**Location:** ${appointment.locations.join(', ')}\n**Time:** ${start} - ${end}`,
                                    inline: false
                                };
                            }),
                            color: 0x00ff00
                        }
        
                        //send the embed to the user and delete it after 5 minutes
                        await channel.send({ embeds: [embed] }).then(msg => setTimeout(() => msg.delete(), 300000));

                        lastmessage = await channel.lastMessageId;

                        //write discord id and message id to json file
                        const sendFile = await fs.readFile(sendPath, 'utf8');
                        const sendJson = JSON.parse(sendFile);
                        sendJson[key] = lastmessage;
                        await fs.writeFile(sendPath, JSON.stringify(sendJson, null, 2));
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, 3000);
};