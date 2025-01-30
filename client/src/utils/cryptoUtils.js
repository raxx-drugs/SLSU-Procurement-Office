

// /src/utils/cryptoUtils.js
const crypto = window.crypto || window.msCrypto; // For cross-browser compatibility

// Generate a secret key using Web Crypto API
export async function generateSecretKey() {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true, // key is extractable
    ["encrypt", "decrypt"]
  );
}

// Encrypt data with the secret key
export async function encryptData(data, secretKey) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    secretKey,
    encodedData
  );

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encryptedData)),
  };
}


// Decrypt data with AES-GCM
export async function decryptData(encryptedData, secretKey) {


    try {
      // Check if encryptedData is valid
      if (!encryptedData || !encryptedData.iv || !encryptedData.data) {
        throw new Error("Invalid encrypted data structure");
      }
  
      
      const iv = new Uint8Array(encryptedData.iv); // Convert IV back to Uint8Array
      const data = new Uint8Array(encryptedData.data); // Convert encrypted data back to Uint8Array
  

      
      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv, // Make sure IV is correct
        },
        secretKey, // Ensure the same secret key is used
        data
      );
  
      // Decode the decrypted data from bytes to string
      const decodedData = new TextDecoder().decode(decryptedData);

  
      // Check if the decrypted string is empty
      if (!decodedData) {
        throw new Error("Decryption succeeded but returned empty data");
      }
  
      // Attempt to parse the JSON string
      try {
        return JSON.parse(decodedData); // Return parsed JSON object
      } catch (err) {
     
        throw new Error("Decrypted data is not valid JSON");
      }
    } catch (err) {

      throw err; // Re-throw the error to handle it in the component
    }
  }


// Store secret key in localStorage
export async function storeSecretKey(secretKey) {
  const exportedKey = await window.crypto.subtle.exportKey('jwk', secretKey);
  localStorage.setItem('secretKey', JSON.stringify(exportedKey));
  return exportedKey; // This is serializable and can be stored in Redux
}

// Retrieve secret key from localStorage
export async function retrieveSecretKey(jwkKey) {
  return await window.crypto.subtle.importKey(
    'jwk',
    jwkKey,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );
}
