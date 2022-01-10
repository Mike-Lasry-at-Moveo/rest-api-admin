import CryptoJS from 'crypto-js'
import crypto from 'crypto';

enum Props {
    ALGORITHM = 'aes-256-cbc',
    ENCODING = 'hex',
    IV_LENGTH = 16,
    IV = "12345678901234567890123456789012",
    SHA = 'sha512',
    ITERS_COUNT = 100000,
    KEY = "write your key here and tell no1"
}

const encryptString = (plainText: string) =>{ 
    return CryptoJS.AES.encrypt(plainText, 'secretkey').toString();
}

const decryptString = (cipherText: string) =>{ 
    return CryptoJS.AES.decrypt(cipherText, 'secretkey').toString(CryptoJS.enc.Utf8);
}

const encryptJson = (plainObject: JSON) =>{ 
    return CryptoJS.AES.encrypt(JSON.stringify(plainObject), 'secretkey').toString();
}

const decryptJson = (cipherObject: string) =>{ 
    return JSON.parse(CryptoJS.AES.decrypt(cipherObject, 'secretkey').toString(CryptoJS.enc.Utf8));
}

// Passwords Hashing functions 

const generateSalt = () => {
    return crypto.randomBytes(Props.KEY.length).toString(Props.ENCODING);
}

const hashPassword = (password: string, salt: string) => {
    return crypto.pbkdf2Sync(password, salt, Props.ITERS_COUNT, Props.KEY.length, Props.SHA).toString(Props.ENCODING);
}


export const securityService = { 
    encryptString,
    decryptString, 

    encryptJson,
    decryptJson, 

    generateSalt,
    hashPassword,
}