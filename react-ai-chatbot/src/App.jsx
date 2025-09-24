import {useState, useMemo} from "react";
import styles from "./App.module.css";
import {Chat} from "./components/Chat/Chat";
import {Controls} from "./components/Controls/Controls";
import {SettingsButton} from "./components/SettingsButton/SettingsButton";
import {SettingsModal} from "./components/SettingsModal/SettingsModal";
import {Assistant} from "./assistants/openAI";
import {Message} from "./assistants/messages";

function App() {
    const assistant = useMemo(() => new Assistant(), []);
    const [messages, setMessages] = useState([]);
    const [useWebSearch, setUseWebSearch] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
            console.error(error);
        }
    }

    function handleUseWebSearchChange() {
        setUseWebSearch((previousValue) => !previousValue);
    }

    function handleSettingsOpen() {
        setIsSettingsOpen(true);
    }

    function handleSettingsClose() {
        setIsSettingsOpen(false);
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
            <div className={styles.ControlsContainer}>
                <SettingsButton onClick={handleSettingsOpen}/>
                <Controls onSend={handleContentSend}></Controls>
            </div>
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={handleSettingsClose}
                useWebSearch={useWebSearch}
                onWebSearchChange={handleUseWebSearchChange}
            />
        </div>
    );
}

export default App;
