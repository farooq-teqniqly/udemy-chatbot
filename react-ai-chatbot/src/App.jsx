import {useState} from "react";
import styles from "./App.module.css";
import {Chat} from "./components/Chat/Chat";
import {Controls} from "./components/Controls/Controls";
import {Assistant} from "./assistants/openAI";
import {Message} from "./assistants/messages";

function App() {
    const assistant = new Assistant();
    const [messages, setMessages] = useState([]);
    const [useWebSearch, setUseWebSearch] = useState(false);

    function addMessage(message) {
        setMessages((previousMessages) => [...previousMessages, message]);
    }

    async function handleContentSend(content) {
        const message = Message.user(content);
        addMessage(message);

        try {
            const response = await assistant.sendMessage(message, useWebSearch);
            addMessage(Message.assistant(response));
        } catch (error) {
            addMessage(Message.system(content));
            console.log(error);
        }
    }

    function handleUseWebSearchChange() {
        setUseWebSearch((previousValue) => !previousValue);
    }

    return (<div className={styles.App}>
        <header className={styles.Header}>
            <img src="/chat-bot.png" alt="AI Chat Bot" className={styles.Logo}/>
            <h2 className={styles.Title}>AI Chatbot</h2>
        </header>
        <div className={styles.ChatContainer}>
            <Chat messages={messages}></Chat>
        </div>
        <div className={styles.ControlsContainer}>
            <label className={styles.CheckboxLabel}><input type="checkbox" onChange={handleUseWebSearchChange} /> Use web search tool</label>
            <Controls onSend={handleContentSend}></Controls>
        </div>
    </div>)
}

export default App
