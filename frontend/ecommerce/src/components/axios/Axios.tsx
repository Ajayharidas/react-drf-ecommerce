import axios, { AxiosInstance } from "axios";

const useAxios = (): AxiosInstance => {
  const get_baseURL = () => {
    const hostname = window.location.hostname;
    console.log(hostname);

    if (hostname === "localhost") {
      return `http://${hostname}`;
    }
    return `https://${hostname}`;
  };
  const baseURL = get_baseURL();
  const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 300000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return axiosInstance;
};

export default useAxios;
