import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
  withCredentials: true,
  responseType: "json",
});

export default axiosInstance;
