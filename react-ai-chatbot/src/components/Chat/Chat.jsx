import Markdown from "react-markdown";
import styles from "./Chat.module.css"

const WELCOME_MESSAGE = {
    role: "assistant",
    content: "Hi there! \uD83D\uDC4B How can I assist you?"
}

export function Chat({messages}) {
    return <div className={styles.Chat}>
        {[WELCOME_MESSAGE, ...messages].map(({role, content}, index) => (
            <div key={index} data-role={role} className={styles.Message}>
                <Markdown>{content}</Markdown>
            </div>
        ))}
    </div>
}