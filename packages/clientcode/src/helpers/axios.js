import axios from "axios";

export default () => {
  const baseURL = 'http://localhost:5000/';
  let headers = {};
  if (localStorage.getItem('token')) {
    headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  const axiosInstance = axios.create({
    baseURL: baseURL,
    headers,
  });

  axiosInstance.interceptors.request.use(function (config) {
    if (localStorage.getItem('token'))
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  axiosInstance.interceptors.response.use(function (response) {
    console.log('response from API', response)
    return response;
  }, function (error) {
    console.log('Http Error', error.response)
    if (error.response.status == 401) {
      let msg = 'Authentication error';
      console.log('Authentication error', error.response.data.msg); 
    }
    else if (error.response.status == 403) {
      console.log('Unauthorized request', error.response.data.msg)
           
    }
    return Promise.reject(error.response.status);
  });

  return axiosInstance;
};