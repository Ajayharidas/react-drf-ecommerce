import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import useAxios from "./Axios";

const useAxiosWithInterceptor = (
  username?: string,
  password?: string
): AxiosInstance => {
  // Create an Axios instance with base URL and default headers
  const axios = useAxios();

  const navigate = useNavigate();

  // Flag to track if a token refresh is in progress
  let isRefreshing = false;
  // Array of functions to call when the token is refreshed
  let refreshSubscribers: ((token: string) => void)[] = [];

  // Function to refresh the access token using the refresh token
  const refreshToken = async (): Promise<string> => {
    const refresh_token = localStorage.getItem("refresh_token");

    if (refresh_token) {
      try {
        // Request to refresh the access token
        const response = await axios.post<{
          access_token: string;
          refresh_token: string;
        }>("api/custom-token/", {
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        });

        // Store new tokens in localStorage
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);

        return response.data.access_token;
      } catch (err) {
        console.error("Error refreshing token:", err);
        throw err;
      }
    } else {
      throw new Error("No refresh token available");
    }
  };

  // Function to notify all subscribers that the token has been refreshed
  const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
  };

  // Function to add a callback to be called when the token is refreshed
  const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };

  // Request interceptor to add the access token to headers
  axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = localStorage.getItem("access_token");

      console.log(config.url);

      // Define URLs that require authorization
      const urlsRequiringAuth = ["api/verify-token/", "api/revoke-token/"];
      const requiresAuth = urlsRequiringAuth.some((url) =>
        config.url?.includes(url)
      );

      if (requiresAuth) {
        console.log(
          `Request made to ${config.url} with method ${config.method}`
        );
        if (token) {
          // Add Authorization header if token is present
          config.headers.Authorization = `Bearer ${token}`;
          console.log("Authorization header added");
        } else {
          console.log("No access token found");
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle token refresh on 401 errors
  axios.interceptors.response.use(
    async (response: AxiosResponse) => {
      // If response status is 201 and username & password are provided, authenticate the user
      let auth_response = response;
      if (auth_response.status === 201) {
        if (username && password) {
          auth_response = await axios.post<{
            access_token: string;
            refresh_token: string;
          }>("api/custom-token/", {
            grant_type: "password",
            username: username,
            password: password,
          });
        }
      }
      if (auth_response.status === 200) {
        const access_token = response.data?.access_token;
        const refresh_token = response.data?.refresh_token;
        if (access_token && refresh_token) {
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          navigate("/");
        }
      }
      return auth_response;
    },
    async (error: any) => {
      const { config, response } = error;
      const status = response?.status;
      const originalRequest = config;

      // Handle 401 errors, indicating that the token may have expired
      if (status === 401 && !originalRequest._retry) {
        if (!isRefreshing) {
          isRefreshing = true;
          originalRequest._retry = true;

          try {
            // Refresh the token and retry the original request
            const newToken = await refreshToken();
            isRefreshing = false;
            onRefreshed(newToken);
            refreshSubscribers = [];
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (err) {
            console.error("Error during token refresh:", err);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            isRefreshing = false;
            refreshSubscribers = [];
            return Promise.reject(err);
          }
        }

        // If already refreshing, queue the request to retry later
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(axios(originalRequest));
          });
        });
      }

      // Reject the promise with the original error if not handled
      return Promise.reject(error);
    }
  );
  return axios;
};

export default useAxiosWithInterceptor;
