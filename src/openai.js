import { Configuration, OpenAIApi } from "openai";
//import config from "config";
import { TELEGRAM_TOKEN, OPENAI_API_KEY, TEST_ENV} from "../constants/index.js";
import {createReadStream} from "fs";



class OpenAI{

    roles = {
    ASSISTANT: 'assistant',
    USER: 'user',
    SYSTEM: 'system',
    }

constructor(apiKey) {
    const configuration = new Configuration({
        apiKey,
      });
      this.openai = new OpenAIApi(configuration);

}
async chat(messages) {
    try{
        const response = await this.openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages,

        })
        //console.log("from chat()")
        return response //.data.choices[0].message
    }
    catch(e) {console.log("error while gpt chatting", e.message, e);}




}
async transcription(filepath) {
    try{
        const response = await this.openai.createTranscription(
            createReadStream(filepath),
            'whisper-1'
            )
            return response.data.text;


    } catch(e) {console.log("error while creating transcription", e.message);}

}



}

//export const openai = new OpenAI(config.get("OPENAI_API_KEY"))
export const openai = new OpenAI(OPENAI_API_KEY)
