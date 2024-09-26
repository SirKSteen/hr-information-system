import axios from 'axios';

// Ensure your environment variable is available
const baseURL = process.env.REACT_APP_HR_INFORMATION_SYSTEM_SERVER_API;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    // if (config.url !== "/authorize"){
    //   const user = localStorage.getItem('user');
    //   if (user) {
    //     const parsedUser = JSON.parse(user);
    //     if (!config.headers) {
    //       config.headers = {};
    //     }
    //     config.headers['Authorization'] = `Bearer ${parsedUser.token}`;
    //   } else {
    //     throw new axios.Cancel('User not authenticated'); // Cancel the request
    //   }
    // } 

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

