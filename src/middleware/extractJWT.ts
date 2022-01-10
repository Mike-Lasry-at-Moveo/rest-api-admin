import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { securityService } from '../services/security';
import * as config from "../config/config"
const NAMESPACE = "Auth";

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization?.split(" ")[1];
    token = securityService.decryptString(token!);
    if (token) {
        jwt.verify(token, config.SERVER.token.secret, (err, decoded) => {            
            if (err) {
                console.log('err: ', err);
                
                return res.status(404).json({
                    success: false,
                    message: err.message,
                    error: err
                });
            } else {
                res.locals.jwt = decoded;
                next();
            }
        })
    } else {
        return res.status(401).json({
            success: false,
            message: "unauthorizd"
        });
    }
}

export default extractJWT;