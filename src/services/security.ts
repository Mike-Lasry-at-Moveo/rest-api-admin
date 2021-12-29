import crypto from "crypto"

enum Props {
    ALGORITHM = 'aes-256-cbc',
    ENCODING = 'hex',
    IV_LENGTH = 16,
    IV = "12345678901234567890123456789012",
    SHA = 'sha512',
    ITERS_COUNT = 100000,
    KEY = "write your key here and tell no1"
}

// Secured Data Transportation functions

const encrypt = (data: string) => {
    const iv = Buffer.from(Props.IV, Props.ENCODING);
    const cipher = crypto.createCipheriv(Props.ALGORITHM, Props.KEY, iv);
    return Buffer
        .concat([
            cipher.update(data), 
            cipher.final(), 
            iv
        ]).toString(Props.ENCODING);
}

const decrypt = (data: string) => {
    const binaryData = Buffer.from(data, Props.ENCODING);
    const iv = binaryData.slice( -Props.IV_LENGTH );
    const encryptedData = binaryData.slice(0, binaryData.length - iv.length);
    
    const decipher = crypto.createDecipheriv(Props.ALGORITHM, Buffer.from(Props.KEY),iv);

    return Buffer.concat([
        decipher.update(encryptedData),
        decipher.final()
    ]).toString();
}

// Passwords Hashing functions 

const generateSalt = () => {
    return crypto.randomBytes(Props.KEY.length).toString(Props.ENCODING);
}

const hashPassword = (password: string, salt: string) => {
    return crypto.pbkdf2Sync(password, salt, Props.ITERS_COUNT, Props.KEY.length,Props.SHA).toString(Props.ENCODING);
}

export const securityService = { 
    encrypt,
    decrypt, 

    generateSalt,
    hashPassword,
}