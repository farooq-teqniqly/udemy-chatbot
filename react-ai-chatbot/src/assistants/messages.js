export class Message {
    constructor(content, role) {
        this.content = content;
        this.role = role;
    }

    static assistant(content) {
        return new Message(content, "assistant");
    }

    static user(content) {
        return new Message(content, "user");
    }

    static system(content) {
        return new Message(content, "system");
    }
}