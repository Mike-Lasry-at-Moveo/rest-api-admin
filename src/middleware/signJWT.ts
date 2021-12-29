import jwt from "jsonwebtoken";
import * as config from "../config/config"
import { IUser } from "../models/user";

const signJWT = (user: IUser, callback: (err: Error | null | unknown, token: string | null) => void): any => {
    var timeSinceEpoch = new Date().getTime();
    var expirationTime = timeSinceEpoch + Number(config.SERVER.token.expireTime) * 60 * 1000;
    var expirationTimeInSeconds = Math.floor(expirationTime / 1000);

    try{
        console.log("signing token");
        
        jwt.sign(
          {
            fisrtName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            address: user.address,
            role: user.role
          },
          config.SERVER.token.secret, 
          {
              issuer: config.SERVER.token.issuer,
              expiresIn: expirationTimeInSeconds,
              algorithm: "HS256",
          },
          (error, token) => {
              if(error) {
                callback(error, null);
              } else if (token){
                console.log(token);                  
                callback(null, token);
              }
          }
        )
    } catch (error) {
        callback(error, null);
    }
};

export default signJWT;