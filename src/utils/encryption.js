import CryptoJS from 'crypto-js';

// Generate a random encryption key
export const generateKey = () => {
  return CryptoJS.lib.WordArray.random(256/8).toString();
};

// Encrypt file with AES-256
export const encryptFile = (file, password) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const fileData = e.target.result;
        const encrypted = CryptoJS.AES.encrypt(fileData, password).toString();
        resolve(encrypted);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Decrypt file with AES-256
export const decryptFile = (encryptedData, password) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, password);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error('Failed to decrypt file. Invalid password or corrupted data.');
  }
};

// Generate file hash for blockchain verification
export const generateFileHash = (fileData) => {
  return CryptoJS.SHA256(fileData).toString();
};

// Derive encryption key from password using PBKDF2
export const deriveKey = (password, salt) => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: 10000
  }).toString();
};
