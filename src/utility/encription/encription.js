const crypto = require("crypto");

const ENC = process.env.ENC;
const IV = "5183666c72eec9e4";
const ALGO = "aes-256-cbc";

// Function to encrypt text
function encryptText(text) {
    let cipher = crypto.createCipheriv(ALGO, ENC, IV);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

// Function to decrypt text
function decryptText(text) {
    let decipher = crypto.createDecipheriv(ALGO, ENC, IV);
    let decrypted = decipher.update(text, "base64", "utf8");
    return decrypted + decipher.final("utf8");
}

module.exports = { encryptText, decryptText };
