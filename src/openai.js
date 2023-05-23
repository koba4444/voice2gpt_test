import { Configuration, OpenAIApi } from "openai";
import config from "config";
import {createReadStream} from "fs";



class OpenAI{
constructor(apiKey) {
    const configuration = new Configuration({
        apiKey,
      });
      this.openai = new OpenAIApi(configuration);

}
chat() {
    try{}
    catch(e) {console.log("error while chatting", e.message);}




}
async transcription(filepath) {
    try{
        const response = await this.openai.createTranscription(
            createReadStream(filepath),
            'whisper-1'
            )
            return response.data;


    } catch(e) {console.log("error while creating transcription", e.message);}

}



}

export const openai = new OpenAI(config.get("OPENAI_API_KEY"))
