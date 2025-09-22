import {useState} from "react";
import styles from "./App.module.css";
import {Chat} from "./components/Chat/Chat";
import {Controls} from "./components/Controls/Controls";
import {Assistant} from "./assistants/openAI";
import {Message} from "./assistants/messages";

function App() {
    const assistant = new Assistant();
    const [messages, setMessages] = useState([]);

    function addMessage(message) {
        setMessages((previousMessages) => [...previousMessages, message]);
    }

    async function handleContentSend(content) {
        const message = Message.user(content);
        addMessage(message);

        try {
            const response = await assistant.sendMessage(message);
            addMessage(Message.assistant(response));
        } catch (error) {
            addMessage(Message.system(content));
            console.log(error);
        }
    }

    return (<div className={styles.App}>
        <header className={styles.Header}>
            <img src="/chat-bot.png" alt="AI Chat Bot" className={styles.Logo}/>
            <h2 className={styles.Title}>AI Chatbot</h2>
        </header>
        <div className={styles.ChatContainer}>
            <Chat messages={messages}></Chat>
        </div>
        <Controls onSend={handleContentSend}></Controls>
    </div>)
}

export default App
