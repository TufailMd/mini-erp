import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle standard errors or unwrap data
apiClient.interceptors.response.use(
  (response) => {
    // Standard backend wraps success in { success, data }
    if (response.data && response.data.success !== undefined) {
      if (!response.data.success) {
        return Promise.reject(new Error(response.data.message || "API Error"));
      }
      return response.data.data; // unwrap actual data
    }
    return response.data; // fallback for non-wrapped responses
  },
  (error) => {
    console.error("API call failed:", error);
    // Could handle 401 Unauthorized globally here to dispatch logout
    const msg = error.response?.data?.message || error.message || "Network Error";
    return Promise.reject(new Error(msg));
  }
);

export default apiClient;
