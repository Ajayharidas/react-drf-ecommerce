import React from "react";
import { useGoogleLogin, CodeResponse } from "@react-oauth/google";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";

const CustomGoogleLogin: React.FC = () => {
  const axios = useAxiosWithInterceptor();

  const login = useGoogleLogin({
    onSuccess: async (response: CodeResponse) => {
      console.log(response);
      try {
        await axios.post("/api/exchange-code/", {
          grant_type: "authorization_code",
          redirect_uri: "http://localhost",
          code: response.code,
        });
      } catch (error) {
        console.error("Error during code exchange:", error);
      }
    },
    onError: (error: any) => {
      console.error("Error during Google login:", error);
    },
    flow: "auth-code",
    scope: "email profile",
  });

  return <button onClick={() => login()}>Sign in with Google</button>;
};

export default CustomGoogleLogin;
