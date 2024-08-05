import React from "react";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const axios = useAxiosWithInterceptor();
  const { setIsAuthenticated, handleuser } = useUserContext();
  const handleLogout = async () => {
    try {
      const response = await axios.post("api/revoke-token/", {});
      if (response) {
        console.log(response.data);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthenticated(false);
        handleuser(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };
  return (
    <>
      <button onClick={handleLogout}>Log Out</button>
    </>
  );
};

export default Logout;
