import { Telegraf } from "telegraf";
import { code } from 'telegraf/format'
import { message } from "telegraf/filters";
import config from "config";
import {ogg} from "./ogg.js"
import { openai } from "./openai.js";




const bot = new Telegraf(config.get( "TELEGRAM_TOKEN" ));

bot.command("start", async(ctx) => {
    await ctx.reply(JSON.stringify(ctx.message, null, 2));
    await ctx.reply("Hello, I'm a bot");
});
bot.on(message("voice"), async(ctx) => {
    try{
        //await ctx.reply("Я вас услышал и жду ответа от OpenAI")
        await ctx.reply(code("Я вас услышал и жду ответа от OpenAI"));
        //await ctx.reply(JSON.stringify(ctx.message.voice, null, 2));
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
        const userId = String(ctx.message.from.id);

        console.log(link.href);
        const oggPath = await ogg.create(link.href, userId);
        const mp3Path = await ogg.toMp3(oggPath, userId);
        const text = await openai.transcription(mp3Path);
        //const response = await openai.chat(text);


        await ctx.reply(text);
    } catch{
        console.log("error while  receiving voice message", e.message);
    }

    await ctx.reply("You said something", { reply_to_message_id: ctx.message.message_id });
})

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
