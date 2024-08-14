import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";
import { AxiosResponse } from "axios";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

interface UserContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  verifyToken: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextProviderProps {
  children: ReactNode;
}

const UserContextProvider: FC<UserContextProviderProps> = ({ children }) => {
  const axios = useAxiosWithInterceptor();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const verifyToken = async () => {
    const token = localStorage.getItem("access_token");

    try {
      if (token) {
        const response: AxiosResponse<{ user: User }> = await axios.get(
          "api/verify-token/"
        );

        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        verifyToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

export { UserContextProvider, useUserContext };
