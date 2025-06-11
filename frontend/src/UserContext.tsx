import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { useCookies } from "react-cookie";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  // Add other user properties here
}

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  fetchUserData: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => null, // No-op function with the correct type
  fetchUserData: async () => {
    // Placeholder function, will be overridden in the provider
  },
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cookies] = useCookies(["token"]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/info", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Kunde inte hämta användarinformation");

      const data = await response.json();
      setUser(data.user); // Uppdatera UserContext med ny data
    } catch (error) {
      console.error("Fel vid hämtning av användarinformation:", error);
    }
  };

  useEffect(() => {
    console.log("Cookies:", cookies); // Debugging: Log cookies to check their values
    if (cookies.token) {
      fetchUserData();
    }
  }, [cookies.token]);

  const value = useMemo(
    () => ({ user, setUser, fetchUserData }),
    [user, setUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
