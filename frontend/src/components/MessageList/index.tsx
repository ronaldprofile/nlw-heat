import { useEffect, useState } from "react";
import io from "socket.io-client";
import { api } from "../../services/api";

import logoImage from "../../assets/logo.svg";
import styles from "./styles.module.scss";

interface IMessage {
  id: string;
  text: string;

  user: {
    name: string;
    avatar_url: string;
  };
}

const messagesQueue: IMessage[] = [];

const socket = io("http://localhost:4000");
socket.on("new_message", (newMessage: IMessage) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(prevState =>
          [messagesQueue[0], prevState[0], prevState[1]].filter(Boolean)
        );
        messagesQueue.shift();
      }
    }, 2000);
  }, []);

  useEffect(() => {
    async function getMessages() {
      const response = await api.get<IMessage[]>("/recent/messages");
      setMessages(response.data);
    }

    getMessages();
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImage} alt="logo do DoWhile" />

      <ul className={styles.messageList}>
        {messages.length > 0 &&
          messages.map(message => {
            return (
              <li key={message.id} className={styles.messageItem}>
                <p className={styles.messageContent}>{message.text}</p>

                <div className={styles.messageUser}>
                  <div className={styles.userImage}>
                    <img
                      src={message.user.avatar_url}
                      alt={message.user.name}
                    />
                  </div>

                  <span>{message.user.name}</span>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
