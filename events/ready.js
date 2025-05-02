const {Events, ActivityType} = require('discord.js');


module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client, message) {
        console.log(`+ ${client.user.tag}`);
    }
};