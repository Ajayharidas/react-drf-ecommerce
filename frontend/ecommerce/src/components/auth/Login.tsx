import React, { useState } from "react";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";
import CustomGoogleLogin from "../hook/GoogleHooks";
import CustomFacebookLogin from "../hook/FacebookHook";

const Login: React.FC = () => {
  const initialdata = Object.freeze({
    grant_type: "password",
    username: "",
    password: "",
  });

  const [formdata, setFormdata] = useState(initialdata);
  const axios = useAxiosWithInterceptor(formdata.username, formdata.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormdata((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("api/custom-token/", formdata);
    } catch (error) {
      console.error("Error in user login", error);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
            value={formdata.username}
            onChange={handleChange}
            name="username"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={formdata.password}
            onChange={handleChange}
            name="password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <CustomGoogleLogin />
        <CustomFacebookLogin />
      </form>
    </>
  );
};

export default Login;
