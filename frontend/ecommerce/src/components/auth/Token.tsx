import { useEffect } from "react";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const VerifyToken = () => {
  const navigate = useNavigate();
  const axios = useAxiosWithInterceptor();
  const { setIsAuthenticated, handleuser } = useUserContext();

  useEffect(() => {
    const checkAuth = async () => {
      const access_token = localStorage.getItem("access_token");
      try {
        if (access_token) {
          const response = await axios.get("api/verify-token/");

          if (response.status === 200) {
            setIsAuthenticated(true);
            handleuser(response.data.user);
          }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setIsAuthenticated(false);
        handleuser(null);
        navigate("/login");
      }
    };

    checkAuth();
  }, []);
};

export default VerifyToken;
