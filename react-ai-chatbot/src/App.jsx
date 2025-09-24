import {useState, useMemo} from "react";
import styles from "./App.module.css";
import {useSettingsStore} from "./stores/settingsStore";
import {Chat} from "./components/Chat/Chat";
import {Controls} from "./components/Controls/Controls";
import {SettingsButton} from "./components/SettingsButton/SettingsButton";
import {SettingsModal} from "./components/SettingsModal/SettingsModal";
import {Loader} from "./components/Loader/Loader";
import {Assistant} from "./assistants/openAI";
import {Message} from "./assistants/messages";

function App() {
    const assistant = useMemo(() => new Assistant(), []);
    const [messages, setMessages] = useState([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const useWebSearch = useSettingsStore((state) => state.useWebSearch);

    function addMessage(message) {
        setMessages((previousMessages) => [...previousMessages, message]);
    }

    async function handleContentSend(content) {
        const message = Message.user(content);
        addMessage(message);
        setIsLoading(true);
        setDisabled(true);
        try {
            const response = await assistant.sendMessage(message, useWebSearch);
            addMessage(Message.assistant(response));
        } catch (error) {
            addMessage(Message.system(content));
            console.error(error);
        } finally {
            setIsLoading(false);
            setDisabled(false);
        }
    }

    function handleSettingsOpen() {
        setIsSettingsOpen(true);
    }

    function handleSettingsClose() {
        setIsSettingsOpen(false);
    }

    return (<div className={styles.App}>
        {isLoading && <Loader></Loader>}
        <header className={styles.Header}>
            <img src="/chat-bot.png" alt="AI Chat Bot" className={styles.Logo}/>
            <h2 className={styles.Title}>AI Chatbot</h2>
        </header>
        <div className={styles.ChatContainer}>
            <Chat messages={messages}></Chat>
        </div>
        <div className={styles.ControlsContainer}>
            <SettingsButton disabled={disabled} onClick={handleSettingsOpen}/>
            <Controls disabled={disabled} onSend={handleContentSend}></Controls>
        </div>
        <SettingsModal
            isOpen={isSettingsOpen}
            onClose={handleSettingsClose}
        />
    </div>);
}

export default App;
