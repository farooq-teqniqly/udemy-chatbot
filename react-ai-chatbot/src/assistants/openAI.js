import {OpenAI} from "openai";

const openAI = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

const USE_WEB_SEARCH_TOOL_DIRECTIVE = "[use-tool-web-search]";

export class Assistant {
    #model;

    constructor(model = "gpt-4o-mini") {
        this.#model = model;
    }

    async sendMessage({content, role}) {
        const body = {
            model: this.#model,
            input: [
                {
                    role,
                    content
                }
            ]
        };

        if (content.toLowerCase().endsWith(USE_WEB_SEARCH_TOOL_DIRECTIVE)) {
            body["tools"] = [{type: "web_search"}];

            content.replace(USE_WEB_SEARCH_TOOL_DIRECTIVE, "");
        }

        const response = await openAI.responses.create(body);

        return response.output_text;
    }
}
