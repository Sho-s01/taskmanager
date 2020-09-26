var crypto = require("crypto");
const bcrypt = require('bcryptjs');
var cipher_algo = "aes256"
var key = "KHKJqlkw1231LKJadsa0NVMBqw5tR98Z"
var encoding = "hex"
var ivLength = 16

function encrypt(text){
      let iv = crypto.randomBytes(ivLength);
      let cipher = crypto.createCipheriv(cipher_algo, new Buffer(key), iv);
      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      encrypted = iv.toString(encoding) + ':' + encrypted.toString(encoding);
      return encrypted.toString();
}
function decrypt(encrypted){
      let parts = encrypted.split(':');
      let iv = new Buffer(parts.shift(), encoding);
      let encryptedText = new Buffer(parts.join(':'), encoding);
      let decipher = crypto.createDecipheriv(cipher_algo, new Buffer(key), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
}

let saltValue = 10;

module.exports= {
    encrypt: encrypt,
    decrypt: decrypt,
    saltValue: saltValue
 }