// src/api.ts
import axios from "axios";
import { BACKEND_URL } from "./config";

const api = axios.create({
  baseURL: BACKEND_URL, // backend URL
  withCredentials: true, // IMPORTANT: send cookies
});

export default api;
