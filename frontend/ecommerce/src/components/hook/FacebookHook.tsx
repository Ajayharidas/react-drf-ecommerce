import React from "react";
import { FacebookProvider, LoginButton } from "react-facebook";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";

// Define the type for the Facebook login response
interface FacebookLoginResponse {
  tokenDetail: {
    accessToken: string;
  };
}

const CustomFacebookLogin: React.FC = () => {
  const axios = useAxiosWithInterceptor();
  const handleResponse = async (data: FacebookLoginResponse) => {
    console.log(data); // This will log the response from Facebook

    try {
      const res = await axios.post("/api/facebook-login/", {
        access_token: data.tokenDetail.accessToken,
      });

      console.log(res.data); // Handle the response from your backend
    } catch (error) {
      console.error("Error during Facebook login", error);
    }
  };

  const handleError = (error: any) => {
    console.error("Error during Facebook login", error);
  };

  return (
    <FacebookProvider appId="989625229043444">
      <LoginButton
        scope="public_profile"
        onSuccess={() => handleResponse}
        onError={handleError}
      >
        <span>Login via Facebook</span>
      </LoginButton>
    </FacebookProvider>
  );
};

export default CustomFacebookLogin;
