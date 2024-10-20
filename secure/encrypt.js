const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');

// Ensure the secret key length is correct
if (secretKey.length !== 32) {
    throw new Error('Invalid secret key length. Must be 32 bytes.');
}

// Function to generate a new IV
const getIV = () => crypto.randomBytes(16);

// Function to encrypt text
const encrypt = (text) => {
    const iv = getIV();
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

// Function to decrypt text
const decrypt = (encryptedText) => {
    const iv = Buffer.from(encryptedText.iv, 'hex');
    const content = Buffer.from(encryptedText.content, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(content);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

// Export functions
module.exports = { encrypt, decrypt };
