import axios from "axios";
import { redirectToCognito } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let redirectCount = 0;
const MAX_REDIRECTS = 3;
const REDIRECT_RESET_TIME = 5000; // Reset counter after 5 seconds

axiosInstance.interceptors.response.use(
  (response) => {
    // Reset redirect count on successful request
    redirectCount = 0;
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      redirectCount++;

      if (redirectCount >= MAX_REDIRECTS) {
        console.error("Too many authentication redirects. Please check your configuration.");
        alert("Authentication error. Please contact support if this persists.");
        return Promise.reject(error);
      }

      // Reset counter after timeout
      setTimeout(() => {
        redirectCount = 0;
      }, REDIRECT_RESET_TIME);

      redirectToCognito();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
