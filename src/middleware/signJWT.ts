import jwt from "jsonwebtoken";
import * as config from "../config/config"
import { IUser } from "../models/user";

const getExpTime = () =>{
  const issuedAt = new Date().getTime();
  const lifetime = Number(config.SERVER.token.expireTime) * 60000;
  const expTime_MS = issuedAt + lifetime;
  return Math.floor(expTime_MS / 1000);
};

const getSignOptions = (exp: number): jwt.SignOptions => {
  return {
    issuer: config.SERVER.token.issuer,
    expiresIn: exp,
    algorithm: "HS256"
  }
};

const getPayload = (user: IUser) => {
  return {
    fisrtName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    address: user.address,
    role: user.role
  }
};

const signJWT = (user: IUser, callback: (err: Error | null | unknown, token: string | null) => void): any => {
  try{        
    jwt.sign(
      getPayload(user), 
      config.SERVER.token.secret,
      getSignOptions(getExpTime()),
      (error, token) => {
        if(error) callback(error, null);
        else if (token) callback(null, token);              
      }
    )
  } catch (error) { callback(error, null); }
};

export default signJWT;