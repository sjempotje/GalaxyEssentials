const Premium = require("../../plugins/schemas/premium.js");

module.exports = async (client) => {
    client.logger.info(`Logged in ${client.user.tag}`)

    // Auto Deploy
    require("../../plugins/autoDeploy.js")(client)
    // Webserver (Express)
    require("../../plugins/webserver.js")(client)
    const users = await Premium.find();
    users.forEach(user => client.premiums.set(user.Id, user))

    let guilds = client.guilds.cache.size;
    let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let channels = client.channels.cache.size;

    const activities = [
        `over ${members} users! | 📡`,
        `Galaxy Essentials | /help`,
        `Monitoring everything! | 📡`,
    ]

    setInterval(() => {
        client.user.setPresence({ 
            activities: [{ name: `${activities[Math.floor(Math.random() * activities.length)]}`, type: 3 }], 
            status: 'online', 
        });
    }, 100000)

    //start the express server from the webserver.js fil
};

