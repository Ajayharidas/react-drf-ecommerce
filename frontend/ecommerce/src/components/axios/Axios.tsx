import axios, { AxiosInstance } from "axios";

const useAxios = (): AxiosInstance => {
  const baseURL = "http://localhost/";
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
