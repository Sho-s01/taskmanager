const axios = require('axios');

axios.interceptors.request.use(req => {
  console.log('---------',`${req.method} ${req.url}`);
  // Important: request interceptors **must** return the request.
//   return req;
});

// // Prints "get https://httpbin.org/get"
// await axios.get('https://httpbin.org/get');

// // Prints "post https://httpbin.org/post"
// await axios.post('https://httpbin.org/post', {});