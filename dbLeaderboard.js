const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const Board = require('../../models/leaderbordoStructure');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qr-leaderboardas')
        .setDescription('Parodo kiek kas siuntęs successful QR kodukų'),
    async execute(interaction) {
        try {
            const useriai = await Board.findAll({order: [['koduku_count', 'DESC']], raw: true});
            if (useriai.length > 0) {
                const medaliai = ['🥇', '🥈', '🥉'];

                const useriaiAsString = useriai.map((u, index) => {
                    const emoji = medaliai[index] || '';
                    return `${emoji} **${u.displayname}** (${u.username}) - **${u.koduku_count}**`;
                }).join('\n');
                await interaction.reply({content: `## QR kodukų atsiuntimo leaderboard'as\n` + useriaiAsString, ephemeral: false });
            } else {
                await interaction.reply("Leaderboard sąraše nieko nėra.");
            }
        } catch (error) {
            console.error("DB Error:", error);
            await interaction.reply({content: "Įvyko klaida skaitant duomenis.", ephemeral: true});
        }
    }
}