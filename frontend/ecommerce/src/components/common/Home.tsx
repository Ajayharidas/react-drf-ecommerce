import React from "react";
import { useUserContext } from "../context/UserContext";
import VerifyToken from "../auth/Token";

const Home: React.FC = () => {
  const { isAuthenticated, user } = useUserContext();
  VerifyToken();
  return (
    <>
      {isAuthenticated ? (
        <p>{`Welcome ${user?.first_name} ${user?.last_name}`}</p>
      ) : (
        <p>Welcome anonymous user</p>
      )}
    </>
  );
};

export default Home;
