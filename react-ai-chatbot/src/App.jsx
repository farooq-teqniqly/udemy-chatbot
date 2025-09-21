import {useState} from "react";
import styles from "./App.module.css";
import {Chat} from "./components/Chat/Chat";
import {Controls} from "./components/Controls/Controls";

function App() {
    const [messages, _] = useState(MESSAGES);

    return (
        <div className={styles.App}>
            <header className={styles.Header}>
                <img src="/chat-bot.png" alt="AI Chat Bot" className={styles.Logo}/>
                <h2 className={styles.Title}>AI Chatbot</h2>
            </header>
            <div className={styles.ChatContainer}>
                <Chat messages={messages}></Chat>
            </div>
            <Controls></Controls>
        </div>
    )
}

const MESSAGES = [
    {
        role: "user",
        content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus."
    },
    {
        role: "assistant",
        content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus."
    },
    {
        role: "user",
        content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus."
    },
    {
        role: "assistant",
        content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus."
    },
    {
        role: "user",
        content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus."
    },
    {
        role: "assistant",
        content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus."
    },
    {
        role: "user",
        content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus."
    },
    {
        role: "assistant",
        content: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus."
    }
]

export default App
