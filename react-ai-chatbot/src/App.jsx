import {useState} from "react";
import styles from "./App.module.css";
import {Chat} from "./components/Chat/Chat";
import {Controls} from "./components/Controls/Controls";

function App() {
    const [messages, setMessages] = useState([]);

    function handleContentSend(content) {
        setMessages((previousMessages) => [...previousMessages, {role: "user", content}]);
    }

    return (
        <div className={styles.App}>
            <header className={styles.Header}>
                <img src="/chat-bot.png" alt="AI Chat Bot" className={styles.Logo}/>
                <h2 className={styles.Title}>AI Chatbot</h2>
            </header>
            <div className={styles.ChatContainer}>
                <Chat messages={messages}></Chat>
            </div>
            <Controls onSend={handleContentSend}></Controls>
        </div>
    )
}

export default App
