const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField, Client, GatewayIntentBits} = require('discord.js');
const Board = require('../../models/leaderbordoStructure.js');

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]});
client.login(process.env.TOKEN); //reik auth, so..

module.exports = {
    data: new SlashCommandBuilder()
        .setName('db-destroy')
        .setDescription('-'),
    async execute(interaction) {
        /*if (interaction.user.id !== "" && interaction.user.id !== "") {
            await interaction.reply({content: "Prieiga prie šios komandos yra ribojama!", ephemeral: true});
            return;
        }*/ //optional
            try {
                await Board.destroy({ where: {}, truncate: true });
                await interaction.reply({content: "DB destroy'inta.", ephemeral: true});
            } catch (err) {
                console.log(err);
                return interaction.reply({content: "Įvyko klaida destroyinant DB, check logs", ephemeral: true});
            }
    }
}