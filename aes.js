var aesjs = require('aes-js');

const encSeed = '1712024504cf3ac45c2e7bcbf3df62c958b5dc4c6e87f7491ef2c745502b67ce3e671a19a02a118a4634bb9d84e49a3ab7c92299424b2c68bfe11e26adac635b2d9895c5f727c78e6eb1eeef5283ee270d8ffdadff381a24e3a727277dc02537';
const pw = 'ad8881323e145e998f34980f9dfcc1d9';

const iv = aesjs.utils.hex.toBytes(encSeed).slice(0, 16);
console.log("iv ", iv.length);
var aesCbc = new aesjs.ModeOfOperation.cbc(aesjs.utils.hex.toBytes(pw), iv);
var decryptedBytes = aesCbc.decrypt(aesjs.utils.hex.toBytes(encSeed).slice(16, encSeed.length));

// Convert our bytes back into text
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
console.log(decryptedText);
