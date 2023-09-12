/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import { user } from './assets/db.models';
import { readFile } from './utils';

const qrcode = require('qrcode');
const fs = require('fs');
const Jimp = require('jimp');

const tokenAdmin = '6298609369:AAFYUL8NBp3_9bowjy1EIxamJA1NQuCq0A4';
const botAdmin: Telegraf<Context<Update>> = new Telegraf(tokenAdmin);

const tokenPr = '6432421833:AAGS0bcKsohN9qMxS1ndq-bjUrEgiE97XjI';

let listUser: user[];

botAdmin.start(ctx => {
  ctx.reply(
    ' Ciao ' + ctx.from!.first_name + '!',
      Markup.inlineKeyboard([
        //Markup.button.callback('Genera Prevendita', 'prevendita'),
        Markup.button.callback('Lista Pr', 'lista'),
        Markup.button.callback('Aggiungi', 'aggiungi'),
        //Markup.button.callback('del', 'del'), funzione in sviluppo per pulizia dello schermo da admin in automatico
      ])
  );
});

botAdmin.action('del', async ctx => {
  const message = ctx.update!.callback_query!.message!;
  const id = message.message_id
  const chatId = ctx.chat!.id;
  try {
    await botAdmin.telegram.deleteMessage(ctx.chat!.id, id);
    // await ctx.deleteMessage(id - 1);
  } catch (error) {
    console.error('Errore durante l\'eliminazione del messaggio:', error);
  }

})

botAdmin.action('lista', (ctx) => {
  listUser = readFile();
  listUser.forEach((user:user) => {
    ctx.reply('username: ' + user.username + ' ticket: ' + user.ticket + ' status: ' + user.status)
  })
})

botAdmin.action('aggiungi', async (ctx) => {
  listUser = readFile();

  const data: user = { username: 'user', ticket: 15, status: true };
  listUser.push(data);
  fs.writeFile(
    './src/assets/db.json',
    JSON.stringify(listUser),
    (err: any) => {
      if (err) throw err;
      console.log('Data written to file');
    }
  );
})

botAdmin.action('prevendita', async (ctx) => {
  const chatId = ctx.chat!.id;
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
