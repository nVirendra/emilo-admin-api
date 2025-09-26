import axios from "axios";

const EMILO_APP_URL = process.env.EMILO_APP_URL || "http://localhost:3000/api";

//  Create axios instance
const axiosClient = axios.create({
  baseURL: EMILO_APP_URL,
//   timeout: 10000, // 10 sec
  //withCredentials: true // अगर cookies cross-domain भेजनी हों
});
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

//  Response Interceptor (optional - error handling)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
