const {Events, ActivityType} = require('discord.js');

const Board  = require('../models/leaderbordoStructure'); //db


module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client, message) {
        await Board.sync();
        console.log(`+ ${client.user.tag}`);
    }
};
