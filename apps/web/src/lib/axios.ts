import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
