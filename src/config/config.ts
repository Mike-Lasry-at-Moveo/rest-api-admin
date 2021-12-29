const SERVER_TOKEN_EXPIRETIME = 60;
const SERVER_TOKEN_ISSUER = "anissuer";
const SERVER_TOKEN_SECRET = "n01kn0w5wh4t5dt0k3n";


export const SERVER = {
    hostname: "localhost",
    port: 3500,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
}