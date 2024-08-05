import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
  throw new Error("VITE_GOOGLE_CLIENT_ID is not defined");
}

const GoogleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
};

export default GoogleProvider;
