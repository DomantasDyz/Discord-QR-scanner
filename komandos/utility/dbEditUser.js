const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField, Client, GatewayIntentBits} = require('discord.js');
const Board = require('../../models/leaderbordoStructure.js');
const { Sequelize } = require('sequelize');

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]});
client.login(process.env.TOKEN); //reik auth, so..

module.exports = {
    data: new SlashCommandBuilder()
        .setName('db-redaguoti')
        .setDescription('-')
        .addStringOption(option =>
            option.setName("useris")
                .setDescription("-")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("opcija")
                .setDescription("Pridėti/Atimti taškus/Pašalinti iš DB")
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName("kiekis")
                .setDescription("-")
                .setRequired(false)),
    async execute(interaction) {
        /*if (interaction.user.id !== "" && interaction.user.id !== "") {
            await interaction.reply({content: "Prieiga prie šios komandos yra ribojama!", ephemeral: true});
            return;
        }*/ //optional
            const user = interaction.options.getString('useris');
            const veiksmas = interaction.options.getString('opcija');
            const kiekis = interaction.options.getInteger('kiekis');

            try {
                switch (veiksmas) {
                    case "prideti":
                        const persona = await Board.findOne({where: {username: user}});
                        if (persona) {
                            await Board.update(
                                { koduku_count: Sequelize.literal(`koduku_count + ${kiekis}`) },
                                { where: { username: user } }
                            );
                            interaction.reply({
                                content: "Sėkmingai pridėta " + kiekis + " taškų useriui " + persona.username + "!",
                                ephemeral: true
                            });
                        } else {
                            interaction.reply({content: "Toks asmuo DB neegzistuoja.", ephemeral: true});
                        }
                        break;
                    case "atimti":
                        const persona2 = await Board.findOne({where: {username: user}});
                        if (persona2) {
                            await Board.update(
                                { koduku_count: Sequelize.literal(`koduku_count - ${kiekis}`) },
                                { where: { username: user } }
                            );
                            interaction.reply({
                                content: "Sėkmingai nuimti " + kiekis + " taškai useriui " + persona2.username + "!",
                                ephemeral: true
                            });
                        } else {
                            interaction.reply({content: "Toks asmuo DB neegzistuoja.", ephemeral: true});
                        }
                        break;
                    case "pasalinti":
                            await Board.destroy({ where: { username: user } });
                            interaction.reply({content: "Sėkmingai pašalintas.", ephemeral: true});
                        break;
                    default:
                        interaction.reply({content: "Toks veiksmas neegzistuoja.", ephemeral: true});
                }
            }catch(err) {
                interaction.reply({content: "Įvyko klaida redaguojant! More info konsolej.", ephemeral: true});
                console.log(err);
            }
    }
}