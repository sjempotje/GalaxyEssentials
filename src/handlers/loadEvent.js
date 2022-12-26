const { readdirSync } = require('fs');

module.exports = async (client) => {
    const loadcommand = dirs =>{
        const events = readdirSync(`./src/events/${dirs}/`).filter(d => d.endsWith('.js'));
        for (let file of events) {
            const evt = require(`../events/${dirs}/${file}`);
            const eName = file.split('.')[0];
            client.on(eName, evt.bind(null, client));
        }
    };
    ["client", "guild"].forEach((x) => loadcommand(x));
    client.logger.info('Client Events Loaded!');
    console.log('   ______            __    ______                                 __     _             __        ');
    console.log('  / ____/  ____ _   / /   / ____/   _____   _____  ___    ____   / /_   (_)  ____ _   / /   _____');
    console.log(' / / __   / __ `/  / /   / __/     / ___/  / ___/ / _ \\  / __ \\ / __/  / /  / __ `/  / /   / ___/');
    console.log('/ /_/ /  / /_/ /  / /   / /___    (__  )  (__  ) /  __/ / / / // /_   / /  / /_/ /  / /   (__  ) ');
    console.log('\\____/   \\__,_/  /_/   /_____/   /____/  /____/  \\___/ /_/ /_/ \\__/  /_/   \\__,_/  /_/   /____/ ');
    console.log('                                                                                                 ');
};