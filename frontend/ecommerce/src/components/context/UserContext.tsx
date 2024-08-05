import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

// Define the interface for the context value
interface UserContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  handleuser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create the context with an initial value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the context provider component props
interface UserContextProviderProps {
  children: ReactNode;
}

// Define the context provider component
const UserContextProvider: FC<UserContextProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const handleuser: React.Dispatch<React.SetStateAction<User | null>> = (
    data
  ) => {
    setUser(data);
  };

  return (
    <UserContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, handleuser }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

// Export the provider and the custom hook
export { UserContextProvider, useUserContext };
