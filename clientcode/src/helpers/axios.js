import axios from "axios";

export default (history = null) => {
  const baseURL = 'http://localhost:8080/';


  let headers = {};

  if (localStorage.getItem('token')) {
    headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  console.log('baseurl',baseURL,'heders',headers)
  const axiosInstance = axios.create({
    baseURL: baseURL,
    headers,
  });

  axiosInstance.interceptors.request.use(function (config) {
  console.log('config--',config)
  if(localStorage.getItem('token'))
   config.headers.Authorization =   `Bearer ${localStorage.getItem('token')}`;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  axiosInstance.interceptors.response.use(function (response) {
    console.log('response from API',response)
    return response;
  }, function (error) {
    console.log('Http Error',error.response)
    if (error.response.status == 401) {
      let msg = 'Authentication error';
      console.log('Authentication error',error.response.data.msg)
      localStorage.clear();
      // this.route.navigate(['/auth/login']);
    }
    else if (error.response.status == 403) {
      console.log('Unauthorized request',error.response.data.msg)
      let msg = ''
      localStorage.clear();
      // this.route.navigate(['/auth/login']);
  }
    return Promise.reject(error.response.status);
  });

  return axiosInstance;
};