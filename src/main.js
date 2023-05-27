import { Telegraf, session } from "telegraf";
import { code } from 'telegraf/format'
import { message } from "telegraf/filters";
import config from "config";
import {ogg} from "./ogg.js"
import { openai } from "./openai.js";


const INITIAL_SESSION = {
    messages: [],
}


const bot = new Telegraf(config.get( "TELEGRAM_TOKEN" ));
bot.use(session());
bot.command("new", async(ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.reply("Жду вашего голосового или текстового сообщения");
})

bot.command("start", async(ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.reply("Жду вашего голосового или текстового сообщения");
});
bot.on(message("voice"), async(ctx) => {
    console.log(ctx.session);
    ctx.session ??= INITIAL_SESSION;
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
        await ctx.reply(code(`Ваш вопрос: ${text}`));
        ctx.session.messages.push({role: openai.roles.USER, content: text});
        //const messages = [{role: openai.roles.USER, content: text}]



        const response = await openai.chat(ctx.session.messages);

        ctx.session.messages.push({role: openai.roles.ASSISTANT, content: response.data.choices[0].message.content});
        console.log({role: openai.roles.ASSISTANT, content: response.data.choices[0].message.content});
        console.log(ctx.session.messages);

        await ctx.reply(response.data.choices[0].message.content);

    } catch{
        console.log("error while  receiving voice message", e.message);
    }
    await ctx.reply("Чем я могу помочь?");
    //await ctx.reply("You said something", { reply_to_message_id: ctx.message.message_id });
})

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
