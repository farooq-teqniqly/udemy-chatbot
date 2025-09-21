import {GoogleGenAI} from "@google/genai";

const googleAI = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY
});

export class Assistant {
    #chat;

    constructor(model = "gemini-2.5-flash-lite") {
        this.#chat = googleAI.chats.create({
            model,
            history: []
        });
    }

    async sendMessage(message) {
        const response = await this.#chat.sendMessage({message});
        return response.text;
    }
}