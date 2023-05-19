"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const qrcode = require('qrcode');
const fs = require('fs');
const Jimp = require('jimp');
const token = '5978681198:AAGUSDMHg-PEvs-BygeWOYW2s_korID6Aw8'; // process.env.BOT_TOKEN as string;
const telegram = new telegraf_1.Telegram(token);
const bot = new telegraf_1.Telegraf(token);
const chatId = process.env.CHAT_ID;
bot.start((ctx) => {
    ctx.reply('Hello ' + ctx.from.first_name + '!');
});
bot.help((ctx) => {
    ctx.reply('Send /start to receive a greeting');
    ctx.reply('Send /keyboard to receive a message with a keyboard');
    ctx.reply('Send /quit to stop the bot');
});
bot.command('quit', (ctx) => {
    // Explicit usage
    ctx.telegram.leaveChat(ctx.message.chat.id);
    // Context shortcut
    ctx.leaveChat();
});
bot.command('keyboard', (ctx) => {
    ctx.reply('Keyboard', telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback('First option', 'first'),
        telegraf_1.Markup.button.callback('Second option', 'second'),
    ]));
});
/*
bot.on('text', (ctx) => {
  ctx.reply(
    'You choose the ' +
      (ctx.message.text === 'first' ? 'First' : 'Second') +
      ' Option!'
  );

  if (chatId) {
    telegram.sendMessage(
      chatId,
      'This message was sent without your interaction!'
    );
  }
});*/
bot.command('prevendita', async (ctx) => {
    const chatId = ctx.chat.id;
    const qrData = 'ciao';
    const qrCodePath = 'qr_code.png';
    const templatePath = './template/template.png'; // Inserisci il percorso del tuo file di template
    try {
        // Genera il QR code come immagine base64
        const qrCodeImage = await qrcode.toDataURL(qrData);
        // Carica il template utilizzando Jimp
        const template = await Jimp.read(templatePath);
        // Decodifica l'immagine base64 in un buffer
        const qrCodeBuffer = Buffer.from(qrCodeImage.split(',')[1], 'base64');
        // Carica il QR code come immagine utilizzando Jimp
        const qrCode = await Jimp.read(qrCodeBuffer);
        // Ridimensiona il QR code per adattarlo al template
        qrCode.resize(200, 200); // Modifica le dimensioni a seconda delle tue esigenze
        // Sovrappone il QR code al template
        const x = 600; // Modifica l'offset orizzontale per posizionare il QR code nel template
        const y = 800; // Modifica l'offset verticale per posizionare il QR code nel template
        template.composite(qrCode, x, y);
        // Salva l'immagine risultante
        await template.writeAsync(qrCodePath);
        console.log('QR code generato con successo.');
        // Invia il QR code come foto al chatId specificato
        await ctx.replyWithPhoto({ source: qrCodePath }, { caption: 'Ecco il QR code generato.' });
        // Elimina il file locale dopo l'invio della foto
        fs.unlinkSync(qrCodePath);
    }
    catch (error) {
        console.error('Si è verificato un errore nella generazione del QR code:', error);
        ctx.reply('Si è verificato un errore nella generazione del QR code.');
    }
});
bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
//# sourceMappingURL=app.js.map