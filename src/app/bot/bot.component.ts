import { Component, OnInit } from '@angular/core';
import * as TelegramBot from 'node-telegram-bot-api';
import * as qrcode from 'qrcode';
import * as fs from 'fs';
import * as Jimp from 'jimp';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.css']
})
export class BotComponent implements OnInit {

   private bot: TelegramBot;

  constructor() {
    // Inizializza il bot Telegram con il token di accesso
    this.bot = new TelegramBot('5978681198:AAGUSDMHg-PEvs-BygeWOYW2s_korID6Aw8', { polling: true });
  }

  ngOnInit(): void {
    
    // Gestisci il comando /prevendita
this.bot.onText(/\/prevendita/, async (msg, match) => {
  const chatId = msg.chat.id;
  const qrData = 'ciao';
  const qrCodePath = 'qr_code.png';
  const templatePath = '../../assets/template.png'; // Inserisci il percorso del tuo file di template

  try {
    // Genera il QR code come immagine
    //await qrcode.toFile(qrCodePath, qrData);
	
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
    this.bot.sendPhoto(chatId, qrCodePath, { caption: 'Ecco il QR code generato.' })
      .then(() => {
        // Elimina il file locale dopo l'invio della foto
        fs.unlinkSync(qrCodePath);
      })
      .catch((error) => {
        console.error('Si è verificato un errore nell\'invio del QR code:', error);
        this.bot.sendMessage(chatId, 'Si è verificato un errore nell\'invio del QR code.');
      });
  } catch (error) {
    console.error('Si è verificato un errore nella generazione del QR code:', error);
    this.bot.sendMessage(chatId, 'Si è verificato un errore nella generazione del QR code.');
  }
});

  }

}
