/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const qrcode = require('qrcode');
const fs = require('fs');
const Jimp = require('jimp');
const tokenAdmin = '6298609369:AAFYUL8NBp3_9bowjy1EIxamJA1NQuCq0A4';
const botAdmin = new telegraf_1.Telegraf(tokenAdmin);
const tokenPr = '6432421833:AAGS0bcKsohN9qMxS1ndq-bjUrEgiE97XjI';
let fileDB;
botAdmin.start((ctx) => {
    ctx.reply(' Ciao ' + ctx.from.first_name + '!', telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback('Genera Prevendita', 'prevendita'),
        telegraf_1.Markup.button.callback('Lista Pr', 'lista'),
        telegraf_1.Markup.button.callback('Leggi', 'leggi'),
        telegraf_1.Markup.button.callback('Scrivi A', 'scriviA'),
        telegraf_1.Markup.button.callback('Aggiungi', 'aggiungi'),
    ]));
});
botAdmin.action('lista', (ctx) => {
    const rawdata = fs.readFileSync('./src/assets/db.json');
    fileDB = JSON.parse(rawdata);
    console.log(fileDB);
    fileDB.forEach((user) => {
        ctx.reply('username: ' + user.username + ' ticket: ' + user.ticket + ' status: ' + user.status);
    });
});
botAdmin.action('leggi', async (ctx) => {
    const rawdata = fs.readFileSync('./src/assets/db.json');
    fileDB = JSON.parse(rawdata);
    console.log(fileDB);
});
botAdmin.action('scriviA', async (ctx) => {
    const rawdata = fs.readFileSync('./src/assets/db.json'); // leggere file solo se filDb vuoto
    fileDB = JSON.parse(rawdata);
    console.log(fileDB);
    const data = [{ username: 'mod', ticket: 15, status: true }];
    fs.writeFile('./src/assets/db.json', JSON.stringify(data), (err) => {
        if (err)
            throw err;
        console.log('Data written to file');
    });
});
botAdmin.action('aggiungi', async (ctx) => {
    const rawdata = fs.readFileSync('./src/assets/db.json');
    fileDB = JSON.parse(rawdata);
    console.log(fileDB);
    const data = { username: 'user', ticket: 15, status: true };
    fileDB.push(data);
    fs.writeFile('./src/assets/db.json', JSON.stringify(fileDB), (err) => {
        if (err)
            throw err;
        console.log('Data written to file');
    });
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
botAdmin.launch();
// Enable graceful stop
process.once('SIGINT', () => botAdmin.stop('SIGINT'));
process.once('SIGTERM', () => botAdmin.stop('SIGTERM'));
//# sourceMappingURL=app.js.map