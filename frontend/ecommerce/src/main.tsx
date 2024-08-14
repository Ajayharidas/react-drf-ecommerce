import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserContextProvider } from "./components/context/UserContext.tsx";
import { CategoryContextProvider } from "./components/context/CategoryContext.tsx";
import GoogleProvider from "./components/context/GoogleContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleProvider>
      <CategoryContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </CategoryContextProvider>
    </GoogleProvider>
  </React.StrictMode>
);
