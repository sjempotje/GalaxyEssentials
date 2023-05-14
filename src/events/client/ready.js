const Premium = require("../../plugins/schemas/premium.js");

module.exports = async (client) => {
    client.logger.info(`Logged in ${client.user.tag}`)

    // Auto Deploy
    require("../../plugins/autoDeploy.js")(client)
    // Webserver (Express)
    require("../../plugins/webserver.js")(client)
    // Magister
    require("../../plugins/magister.js")(client)
    // Credits
    require("../../plugins/credits.js")(client)
    // Metrics
    require("../../plugins/metricsCollector.js")(client)
    // Log Parser
    require("../../plugins/logparser.js")(client)

    const users = await Premium.find();
    users.forEach(user => client.premiums.set(user.Id, user))


    let guilds = client.guilds.cache.size;
    let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);

    const activities = [
        `Creating art as if it's nothing`,
        `Galaxy AI used by ${guilds} guilds`,
        `Galaxy AI used by ${members} members`,
    ]

    setInterval(() => {
        client.user.setPresence({ 
            activities: [{ name: `${activities[Math.floor(Math.random() * activities.length)]}`, type: 3 }], 
            status: 'online', 
        });
    }, 100000)

    //start the express server from the webserver.js fil
};

