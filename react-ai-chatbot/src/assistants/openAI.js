import {OpenAI} from "openai";

const openAI = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export class Assistant {
    #model;

    constructor(model = "gpt-4o-mini") {
        this.#model = model;
    }

    async sendMessage({content, role}) {
        const response = await openAI.responses.create({
            model: this.#model,
            input: [
                {
                    role,
                    content
                }
            ]
        });

        return response.output_text;
    }
}
