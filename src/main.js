import { Telegraf, session } from "telegraf";
import { code } from 'telegraf/format'
import { message } from "telegraf/filters";
//import config from "config";
import { TELEGRAM_TOKEN, OPENAI_API_KEY, TEST_ENV} from "../constants/index.js";

import {ogg} from "./ogg.js"
import { openai } from "./openai.js";

console.log("HIHIHIHIIHIHIHIHIH")
const INITIAL_SESSION = {
    messages: [],
}


//const bot = new Telegraf(config.get( "TELEGRAM_TOKEN" ));
console.log(TELEGRAM_TOKEN)
const bot = new Telegraf(TELEGRAM_TOKEN); 

bot.use(session());
bot.command("new", async(ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.reply("Жду вашего голосового или текстового сообщения");
})

bot.command("start", async(ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.reply("Жду вашего голосового или текстового сообщения");
});

bot.on(message("text"), async(ctx) => {
    console.log(ctx.session);
    ctx.session ??= INITIAL_SESSION;
    await ctx.reply(code("Я тут"));
});

async (req, res) => {
  try {
    await bot.handleUpdate(req.body, res);
    await ctx.reply(code(`Ваш вопрос: ${ctx.message.text}`));
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
