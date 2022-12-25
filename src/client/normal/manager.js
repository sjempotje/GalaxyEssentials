const { Client, GatewayIntentBits, Collection } = require("discord.js");
const Discord = require('discord.js');
const logger = require('../../plugins/logger')
const { I18n } = require("@hammerhq/localization")

class Manager extends Client {
    constructor() {
        super({
            shards: 'auto',
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false
            },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessages,
            ]
        });
    this.config = require("../../plugins/config.js");
    this.owner = this.config.OWNER_ID;
    this.dev = this.config.DEV_ID;
    this.color = this.config.EMBED_COLOR;
    if(!this.token) this.token = this.config.TOKEN;
    this.i18n = new I18n(this.config.LANGUAGE);
    this.logger = logger

    process.on('unhandledRejection', error => this.logger.log({ level: 'error', message: error }));
    process.on('uncaughtException', error => this.logger.log({ level: 'error', message: error }));

    ["slash", "premiums"].forEach(x => this[x] = new Collection());
    ["loadCommand", "loadEvent", "loadDatabase"].forEach(x => require(`../../handlers/${x}`)(this));

	}
		connect() {
        return super.login(this.token);
    };
};

//start ../checker/discord.js

module.exports = Manager;