import {useEffect, useMemo, useRef} from "react";
import Markdown from "react-markdown";
import styles from "./Chat.module.css"

const WELCOME_MESSAGE_GROUP = [{
    role: "assistant",
    content: "Hi there! \uD83D\uDC4B How can I assist you?"
}];

export function Chat({messages}) {
    const messagesEndRef = useRef(null);

    const messageGroups = useMemo(() => messages.reduce((groups, message) => {
        if (message.role === "user") {
            groups.push([]);
        }

        if (groups.length === 0) {
            groups.push([]);
        }

        groups[groups.length - 1].push(message);

        return groups;
    }, []), [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messages]);

    return <div className={styles.Chat}>
        {[WELCOME_MESSAGE_GROUP, ...messageGroups].map((messages, groupIndex) => (
            <div className={styles.Group} key={groupIndex}>
                {messages.map(({role, content}, index) => (
                    <div key={index} data-role={role} className={styles.Message}>
                        <Markdown>{content}</Markdown>
                    </div>
                ))}
            </div>
        ))}

        <div ref={messagesEndRef}></div>
    </div>
}