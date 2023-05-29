"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf/typings/telegraf");
const bot = new telegraf_1.Telegraf('5978681198:AAGUSDMHg-PEvs-BygeWOYW2s_korID6Aw8');
bot.start((context) => {
    console.log('Servizio avviato...');
    context.reply('Servizio ECHO avviato');
});
bot.on('text', (context) => {
    const text = context.update.message.text;
    context.reply('Hai scritto: ' + text);
});
bot.launch();
//# sourceMappingURL=app.js.map
