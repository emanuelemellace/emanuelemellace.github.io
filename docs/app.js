/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const utils_1 = require("./utils");
const qrcode = require('qrcode');
const fs = require('fs');
const Jimp = require('jimp');
const tokenAdmin = '6298609369:AAFYUL8NBp3_9bowjy1EIxamJA1NQuCq0A4';
const botAdmin = new telegraf_1.Telegraf(tokenAdmin);
const tokenPr = '6432421833:AAGS0bcKsohN9qMxS1ndq-bjUrEgiE97XjI';
let listUser;
let addUser = {
    user: {
        username: '',
        ticket: 0,
        status: false
    },
    state: -1
};
const operation = telegraf_1.Markup.inlineKeyboard([
    telegraf_1.Markup.button.callback('Lista PR', 'lista'),
    telegraf_1.Markup.button.callback('Aggiungi PR', 'addUser'),
    //Markup.button.callback('Genera Prevendita', 'prevendita'), // solo per bot pr
    //Markup.button.callback('del', 'del'), funzione in sviluppo per pulizia dello schermo da admin in automatico
]);
botAdmin.start(ctx => {
    ctx.reply(' Ciao ' + ctx.from.first_name + '!', operation);
});
botAdmin.action('lista', (ctx) => {
    listUser = (0, utils_1.readFileDb)();
    if (listUser && listUser.length > 0) {
        listUser.forEach((user) => {
            ctx.reply('username: ' + user.username + ' ticket: ' + user.ticket + ' status: ' + user.status);
        });
    }
    else {
        ctx.reply('Non sono presenti Pr nel sistema');
    }
});
botAdmin.action('addUser', async (ctx) => {
    addUser.state = 0;
    await ctx.reply('Inserisci username:');
});
botAdmin.on('text', async (ctx) => {
    listUser = (0, utils_1.readFileDb)();
    switch (addUser.state) {
        case 0:
            addUser.state = 1;
            addUser.user.username = ctx.update.message.text;
            await ctx.reply('Inserisci numero prevendite:');
            break;
        case 1:
            addUser.state = 2;
            addUser.user.ticket = +ctx.update.message.text;
            await ctx.reply('Attivo gia da ora (y/n):');
            break;
        case 2:
            addUser.state = -1;
            addUser.user.status = ctx.update.message.text.toLowerCase() === 'y';
            listUser.push(addUser.user);
            (0, utils_1.writeFileDb)(listUser);
            await ctx.reply('Utente salvato correttamente', operation);
            break;
    }
});
botAdmin.action('prevendita', async (ctx) => {
    const chatId = ctx.chat.id;
    const qrData = 'ciao';
    const qrCodePath = 'qr_code.png';
    const templatePath = './src/template/template.png'; // Inserisci il percorso del tuo file di template
    try {
        const qrCodeImage = await qrcode.toDataURL(qrData); // Genera il QR code come immagine base64
        const template = await Jimp.read(templatePath); // Carica il template utilizzando Jimp
        const qrCodeBuffer = Buffer.from(qrCodeImage.split(',')[1], 'base64'); // Decodifica l'immagine base64 in un buffer
        const qrCode = await Jimp.read(qrCodeBuffer); // Carica il QR code come immagine utilizzando Jimp
        qrCode.resize(200, 200); // Modifica le dimensioni a seconda delle tue esigenze // Ridimensiona il QR code per adattarlo al template
        const x = 600; // Modifica l'offset orizzontale per posizionare il QR code nel template
        const y = 800; // Modifica l'offset verticale per posizionare il QR code nel template
        template.composite(qrCode, x, y); // Sovrappone il QR code al template
        await template.writeAsync(qrCodePath); // Salva l'immagine risultante
        console.log('QR code generato con successo.');
        await ctx.replyWithPhoto({ source: qrCodePath }, { caption: 'Ecco il QR code generato.' }); // Invia il QR code come foto al chatId specificato
        fs.unlinkSync(qrCodePath); // Elimina il file locale dopo l'invio della foto
    }
    catch (error) {
        console.error('Si è verificato un errore nella generazione del QR code:', error);
        ctx.reply('Si è verificato un errore nella generazione del QR code.');
    }
});
botAdmin.action('del', async (ctx) => {
    const message = ctx.update.callback_query.message;
    const id = message.message_id;
    const chatId = ctx.chat.id;
    try {
        await botAdmin.telegram.deleteMessage(ctx.chat.id, id);
        // await ctx.deleteMessage(id - 1);
    }
    catch (error) {
        console.error('Errore durante l\'eliminazione del messaggio:', error);
    }
});
botAdmin.launch();
// Enable graceful stop
process.once('SIGINT', () => botAdmin.stop('SIGINT'));
process.once('SIGTERM', () => botAdmin.stop('SIGTERM'));
//# sourceMappingURL=app.js.map