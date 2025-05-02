const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nick')
        .setDescription('Keisti slapyvardį pasirinktam vartotojui')
        .addUserOption(option =>
            option.setName("vartotojas")
                .setDescription("Pasirinkto vartotojo tag")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("slapyvardis")
                .setDescription("Naujas slapyvardis")
                .setRequired(true)),
    async execute(interaction) {
        const pV = interaction.options.getUser('vartotojas');
        const vartotojas = interaction.guild.members.cache.get(pV.id);
        console.log(pV);
        const nick = interaction.options.getString('slapyvardis');
            if(vartotojas) {
                try {
                    await vartotojas.setNickname(nick);
                    await interaction.reply({content: `Vartotojui ${pV} slapyvardis sėkmingai pakeistas į *${nick}*!`, ephemeral: true});
                } catch (error) {
                    console.log(error);
                    interaction.reply({content: "Įvyko sisteminė klaida bandant pakeisti nick (galimai botas neturi perms)!", ephemeral: true});
                }
            } else {
                interaction.reply({content: "Toks vartotojas serveryje neegzistuoja!", ephemeral: true});
            }
    },
};