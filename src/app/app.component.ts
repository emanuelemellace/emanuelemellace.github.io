const TelegramBot = require('node-telegram-bot-api');
const qrcode = require('qrcode');
const fs = require('fs');
const Jimp = require('jimp');

// Inizializza il bot con il token di accesso
const bot = new TelegramBot('5978681198:AAGUSDMHg-PEvs-BygeWOYW2s_korID6Aw8', { polling: true });

// Gestisci il comando /prevendita
bot.onText(/\/prevendita/, async (msg ) => {
  const chatId = msg.chat.id;
  const qrData = 'ciao';
  const qrCodePath = 'qr_code.png';
  const templatePath = '../assets/template.png'; // Inserisci il percorso del tuo file di template
  console.log("dddd");

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
    bot.sendPhoto(chatId, qrCodePath, { caption: 'Ecco il QR code generato.' })
      .then(() => {
        // Elimina il file locale dopo l'invio della foto
        fs.unlinkSync(qrCodePath);
      })
      .catch((error) => {
        console.error('Si è verificato un errore nell\'invio del QR code:', error);
        bot.sendMessage(chatId, 'Si è verificato un errore nell\'invio del QR code.');
      });
  } catch (error) {
    console.error('Si è verificato un errore nella generazione del QR code:', error);
    bot.sendMessage(chatId, 'Si è verificato un errore nella generazione del QR code.');
  }
});

