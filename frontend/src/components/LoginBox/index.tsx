import { VscGithubInverted } from "react-icons/vsc";
import { useAuth } from "../../context/Auth";
import styles from "./styles.module.scss";

export function LoginBox() {
  const { signInUrl } = useAuth();

  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Envie e compartilhe sua mensagem</strong>

      <a href={signInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size={24} />
        entrar com github
      </a>
    </div>
  );
}
