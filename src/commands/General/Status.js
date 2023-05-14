const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require('discord.js');
const ms = require('pretty-ms');

//client ip address using nodejs
const os = require('os');
const ifaces = os.networkInterfaces();
const ip = Object.keys(ifaces).reduce((result, dev) => {
  return result.concat(ifaces[dev].reduce((result, details) => {
    return result.concat(details.family === 'IPv4' && !details.internal ? [details.address] : []);
  }, []));
}, [])[0];


module.exports = {
    name: ["status"],
    description: "Shows the status information of the Bot",
    categories: "General",
    premium: false,
    run: async (interaction, client, language) => {
        await interaction.deferReply({ ephemeral: false });
          const info = new EmbedBuilder()
             .setTitle(client.user.tag + " Status")
             .addFields([
              { name: 'Uptime ⏱️', value: `\`\`\`${ms(client.uptime)}\`\`\``, inline: true },
              { name: 'WebSocket Ping 🌐', value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },
              { name: 'Memory 💾', value: `\`\`\`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap\`\`\``, inline: true },
              { name: 'Guild Count 🏰', value: `\`\`\`${client.guilds.cache.size} guilds\`\`\``, inline: true },
              { name: 'User Count 👥', value: `\`\`\`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users\`\`\``, inline: true },
              { name: 'Node.js ⚙️', value: `\`\`\`${process.version} on ${process.platform} ${process.arch}\`\`\``, inline: true },
              { name: 'Cached Data 📚', value: `\`\`\`${client.users.cache.size} users\n${client.channels.cache.size} channels\n${client.emojis.cache.size} emojis\`\`\``, inline: true },
              { name: 'Discord.js 🤖', value: `\`\`\`${version}\`\`\``, inline: true },
              { name: 'GalaxyAI 🚀', value: `\`\`\`v6.0.0\`\`\``, inline: true },
            ])
          
             .setTimestamp()
             .setColor(client.color);
          const row = new ActionRowBuilder()
               .addComponents(
                 new ButtonBuilder()
                   .setLabel("Invite Me")
                   .setStyle("Link")
                   .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
               )
            await interaction.editReply({ embeds: [info], components: [row] });    
    }
};