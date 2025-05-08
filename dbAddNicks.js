const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField, Client, GatewayIntentBits} = require('discord.js');
const Board = require('../../models/leaderbordoStructure.js');

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]});
client.login(process.env.TOKEN); //reik auth, so..

module.exports = {
    data: new SlashCommandBuilder()
        .setName('db-add')
        .setDescription('-'),
    async execute(interaction) {
        /*if (interaction.user.id !== "" && interaction.user.id !== "") {
            await interaction.reply({content: "Prieiga prie šios komandos yra ribojama!", ephemeral: true});
            return;
        }*/ //optional
        const prifID = "";
        const prif = await client.guilds.fetch(prifID);
        const members = await prif.members.fetch();
        let successCount = 0;
        for (const member of members.values()) {
            const jauEgzistuojantisUser = await Board.findOne({where: {id: member.id}});
            try {
                if (!jauEgzistuojantisUser) {
                    await Board.create({
                        id: member.id,
                        username: member.user.username,
                        displayname: member.displayName
                    });
                    successCount++;
                }
            } catch (err) {
                console.log(err);
                return interaction.reply({content: "Įvyko klaida creatinant DB, check logs", ephemeral: true});
            }
        }

        await interaction.reply({
            content: `DB sėkmingai užpildyta ${successCount} useriais.`,
            ephemeral: true
        });
    }
}