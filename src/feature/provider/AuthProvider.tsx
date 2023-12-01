import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "@firebase/auth";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

export type GlobalAuthState = {
  user: User | null | undefined;
  loading: boolean;
};
const initialState: GlobalAuthState = {
  user: undefined,
  loading: true,
};
const AuthContext = createContext<GlobalAuthState>(initialState);

type Props = { children: ReactNode };

export const AuthProvider = ({ children }: Props) => {
  const [state, setState] = useState<GlobalAuthState>(initialState);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      setState({
        user,
        loading: false,
      });
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
