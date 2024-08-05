import axios, { AxiosInstance } from "axios";

const useAxios = (): AxiosInstance => {
  const baseURL = "http://localhost:8000/";
  const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return axiosInstance;
};

export default useAxios;
