import TextareaAutosize from "react-textarea-autosize";
import styles from "./Controls.module.css"
import {useEffect, useRef, useState} from "react";

export function Controls({disabled = false, onSend}) {
    const textareaRef = useRef(null);
    const [content, setContent] = useState("");

    useEffect(() => {
        if (!disabled) {
            textareaRef.current.focus();
        }
    }, [disabled]);

    function handleContentChange(event) {
        setContent(event.target.value);
    }

    function handleContentSend() {
        if (content.length < 1) {
            return;
        }

        onSend(content);
        setContent("");
    }

    function handleEnterPress(event) {
        if (event.key !== "Enter" || event.shiftKey) {
            return;
        }

        event.preventDefault();
        handleContentSend();
    }

    return (
        <div className={styles.Controls}>
            <div className={styles.TextAreaContainer}>
                <TextareaAutosize ref={textareaRef} disabled={disabled} minRows={1} maxRows={10}
                                  placeholder="Message AI Chatbot"
                                  aria-label="Message AI Chatbot" cacheMeasurements className={styles.TextArea}
                                  value={content}
                                  onChange={handleContentChange} onKeyDown={handleEnterPress}></TextareaAutosize>
            </div>
            <button disabled={disabled} className={styles.Button} onClick={handleContentSend}><SendIcon></SendIcon>
            </button>
        </div>
    )
}

function SendIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/>
        </svg>
    )
}