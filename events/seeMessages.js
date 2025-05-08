const {Events, EmbedBuilder, Client, GatewayIntentBits} = require('discord.js');
const {loadImage, createCanvas} = require("canvas");
const {scanImageData} = require('@undecaf/zbar-wasm');
const {mainGuildId, mainChannelId, imgGuildId, imgChannelId} = require('../config.json');

const Board  = require('../models/leaderbordoStructure'); //db


const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const time = new Date();

        const hours = time.toLocaleString('lt-LT', {timeZone: 'Europe/Vilnius', hour: '2-digit', hour12: false});
        const minutes = time.toLocaleString('lt-LT', {timeZone: 'Europe/Vilnius', minute: '2-digit'});
        const vilniusDate = new Date(time.toLocaleString('lt-LT', {timeZone: 'Europe/Vilnius'}));

        console.log("[" + vilniusDate + "]" + " " + message.author.tag + " >> " + message.content);

        const attachments = message.attachments;
        const imageAttachment = attachments.find(attachment => {
            return attachment.contentType && attachment.contentType.startsWith('image/');
        });

        if (message.channel.id === imgChannelId && !imageAttachment && !message.author.bot) {
            message.reply("Šiame kanale galima siųsti tik QR kodukų nuotraukas!")
                .then(m => {
                    setTimeout(function () {
                        m.delete();
                        message.delete();
                    }, 4000);
                });
        } else if (message.channel.id === imgChannelId && imageAttachment) {
            const apdorojama = await message.reply("Nuotrauka apdorojama...");
            const sender = message.author;
            const fail = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Nepavyko nustatyti nuotraukoje esančio QR kodo!")
                .setImage(imageAttachment.url)
                .setTimestamp();

            //console.log(imageAttachment.url);
            try {
                const image = await loadImage(imageAttachment.url);
                const canvas = createCanvas(image.width, image.height);
                const context = canvas.getContext('2d');

                context.drawImage(image, 0, 0);

                const imageData = context.getImageData(0, 0, image.width, image.height);

                const qrCode = await scanImageData(imageData);

                const qrURL = qrCode[0]?.decode();


                //console.log(qrCode[0]?.decode());

                if (qrURL) {
                    const qrURLobj = new URL(qrURL);

                    const success = new EmbedBuilder()
                        .setColor("Green")
                        .setTitle("QR kodas konvertuotas į URL!")
                        .setDescription(qrURL)
                        .setFooter({text: `QR kodą atsiuntė: ${message.author.username}. Gavimo data: ${time.toLocaleString('lt-LT', {timeZone: 'Europe/Vilnius'})}`});

                        if (apdorojama) {
                            await apdorojama.edit("✅");
                            await apdorojama.edit({embeds: [success]});

                            await message.react('🙏🏿');
                            //irasymas i DB

                            const name = message.member?.displayName || message.author.username;
                            const persona = await Board.findOne({where: {id: message.author.id}});
                            if(!persona) {
                                await Board.create({
                                    id: message.author.id,
                                    name: name,
                                    koduku_count: 1
                                });
                            } else {
                                await Board.update(
                                    { koduku_count: Sequelize.literal(`koduku_count + 1`) },
                                    { where: { id: message.author.id } },
                                );
                            }
                        }
                } else {

                    if (apdorojama) {
                        await apdorojama.edit("❌");
                        await apdorojama.edit({embeds: [fail]});
                    }

                }
            } catch (error) {
                console.error(error);
                await message.reply("Įvyko sisteminė klaida bandant apdoroti nuotrauką!");
            }
        }
    }
}
client.login(process.env.TOKEN);
