import { Telegraf } from "https://deno.land/x/telegraf/mod.ts";
import { CryptoPay } from "https://deno.land/x/crypto_pay_api/mod.ts";

const bot = new Telegraf("YOUR_BOT_TOKEN");
const cryptoPay = new CryptoPay("YOUR_API_KEY");

bot.start((ctx) => ctx.reply("Welcome! Use /buy to purchase digital products."));
bot.command("buy", async (ctx) => {
  const invoice = await cryptoPay.createInvoice({
    asset: "BTC",
    amount: 0.001,
    description: "Purchase of digital product",
  });

  ctx.reply(`Please pay using this link: ${invoice.pay_url}`);
});

bot.launch();
