import { FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { VscGithubInverted, VscSignOut } from "react-icons/vsc";
import { useAuth } from "../../context/Auth";
import { api } from "../../services/api";
import styles from "./styles.module.scss";

export function SendMessageForm() {
  const [message, setMessage] = useState("");
  const { user, signOut } = useAuth();

  async function handleSubmitMessage(event: FormEvent) {
    event.preventDefault();

    if (!message.trim()) {
      toast.error("Preencha o campo para enviar uma mensagem");
      return;
    }

    await api.post("messages", { message });
    setMessage("");
    toast.success("Mensagem enviada com sucesso");
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button className={styles.buttonSignOut} onClick={signOut}>
        <VscSignOut size={32} />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>

        <div className={styles.userName}>
          <strong>{user?.name}</strong>
        </div>

        <span className={styles.userGithub}>
          <VscGithubInverted size="16" />
          {user?.login}
        </span>
      </header>

      <form onSubmit={handleSubmitMessage} className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>

        <textarea
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento?"
          onChange={event => setMessage(event.target.value)}
          value={message}
        />

        <button type="submit">enviar mensagem</button>
      </form>
      <Toaster />
    </div>
  );
}
