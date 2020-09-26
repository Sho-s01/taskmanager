const jwt = require('jsonwebtoken');
var access = "auth";
var secret = 'privateKey'

let generateAuthToken = function (uid) {
  var token = jwt.sign({ _id: uid, access }, secret).toString();
  console.log(' '+ uid+ 'token'+ token);
  return token;
}

let getuserId = function (token) {
  var id = jwt.decode(token, access)  
   console.log('id-'+ id)
  return id._id;
}

let generateLoginAuthToken = function (uid) {
  return new Promise((resolve, reject) => {
    jwt.sign({ uid }, secret, { expiresIn: '1h' }, (err, token) => {
      if (err) {
       console.log('Error in generating JWT token' , err)
        reject(err);
      }
      else {
        // console.log('login token', token)
        resolve(token);
      }
    })
  })
}
let verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, authorizedData) => {
      if (err) {
        console.log('unauth error msg'+err.name)
        console.log('ERROR: Forbidden'+ err+'err data-------'+err.data)
        reject(err)
      } else {
        // console.log('Authorized request-', authorizedData);
        resolve(authorizedData)
      }
    })
  })
}
module.exports = {
  generateAuthToken: generateAuthToken,
  getuserId: getuserId,
  generateLoginAuthToken: generateLoginAuthToken,
  verifyToken: verifyToken
}

