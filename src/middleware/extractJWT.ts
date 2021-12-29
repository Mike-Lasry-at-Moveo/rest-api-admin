import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import * as config from "../config/config"
const NAMESPACE = "Auth";

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers);
    let token = req.headers.authorization?.split(" ")[1];
    if (token) {
        jwt.verify(token, config.SERVER.token.secret, (err, decoded) => {
            if (err) {
                return res.status(404).json({
                    success: false,
                    message: err.message,
                    error: err
                });
            } else {
                console.log(`token:`, token);
                res.locals.jwt = decoded;
                next();
            }
        })
    } else {
        console.log("in else statement")
        return res.status(401).json({
            success: false,
            message: "unauthorizd"
        })
    }
}

export default extractJWT;