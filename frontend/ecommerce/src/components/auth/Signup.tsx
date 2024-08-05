import React, { useState } from "react";
import useAxiosWithInterceptor from "../axios/AxiosWithInterceptor";

const Signup: React.FC = () => {
  const initialdata = Object.freeze({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
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
    if (formdata.password !== formdata.confirm_password) {
      console.error("Passwords do not match");
      return;
    }

    try {
      await axios.post("api/register/", formdata);
    } catch (error) {
      console.error("Error in user registration", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter firstname"
            value={formdata.first_name}
            onChange={handleChange}
            name="first_name"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Enter lastname"
            value={formdata.last_name}
            onChange={handleChange}
            name="last_name"
          />
        </div>
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
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={formdata.email}
            onChange={handleChange}
            name="email"
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
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm password"
            value={formdata.confirm_password}
            onChange={handleChange}
            name="confirm_password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </>
  );
};

export default Signup;
