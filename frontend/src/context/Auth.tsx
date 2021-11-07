import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import { api } from "../services/api";

interface IUser {
  id: number;
  name: string;
  login: string;
  avatar_url: string;
}

interface IAuthResponse {
  token: string;
  user: IUser;
}

interface IAuthContextData {
  user: IUser | null;
  signInUrl: string;
  signOut: () => void;
}

interface IAuthProvider {
  children: ReactNode;
}

const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }: IAuthProvider) {
  const [user, setUser] = useState<IUser | null>(null);

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=9477564c7b6ec15299a8`;

  async function signIn(githubCode: string) {
    const response = await api.post<IAuthResponse>("authenticate", {
      code: githubCode
    });

    const { token, user } = response.data;

    localStorage.setItem("@dowhile:token", token);
    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("@dowhile:token");
  }

  useEffect(() => {
    const token = localStorage.getItem("@dowhile:token");

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<IUser>("profile").then(response => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;

    const hasGithubCode = url.includes("?code=");

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split("?code=");

      window.history.pushState({}, "", urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInUrl, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
