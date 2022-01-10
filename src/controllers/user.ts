import { Response, Request, NextFunction } from "express";
import signJWT from "../middleware/signJWT";
import { IUser, User } from "../models/user";
import { securityService } from "../services/security";
import { usersService } from "../services/user";

const getAllUsers = async (req: Request, res: Response) => {
    const Users = await usersService.getUsers();
    res.status(201).send({success:true, data:Users});
};

const getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await usersService.getUserById(id);
    console.log(user);    
    res.status(201).send({success:true, data: user});
};

const createUser = async (firstName: string,lastName: string,username: string,email: string,address: string, password: string) => {
    const user = await usersService.createUser({ firstName,lastName,username,email,address }, password);
    return user != null && user != undefined;
};

const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const {key, value} = req.body;
    const User = await usersService.updateUser(id, key, value);
    res.status(201).send(User);
};

const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const success = await usersService.deleteUser(id);
    res.status(201).send(success);
};

const login = async (req: Request, res: Response) => {    
    const { username, password } = securityService.decryptJson(req.body.data);
    const users = await User.getByUsername(username);
    if(!users || !users.length) 
        return res.status(404).json({success: false, message: "can't find users:", data: users});
    
    const providedHash = securityService.hashPassword(password, users[0].salt);
    let authenticated: boolean = users[0].hash == providedHash;

    if(authenticated){
        signJWT(users[0], (err,token) => {
            let status: number = err ? 500 : 200;
            let success:boolean = err ? false : true;
            let message: string | null = success ? token : null;
            res.status(status).json({success:success, message: message});
        });
    } else res.status(500).json({success: false, message:"Can't sign token", data: null});
}

const signup = async (req: Request, res: Response) => {
    const inPayload = securityService.decryptJson(req.body.data);
    const { firstName,lastName,username,email,address,password } = inPayload;

    const user = { firstName,lastName,username,email,address,password };
    const usersTaken = await usersService.getUserByUsername(user.username);
    if(usersTaken.length != 0) return res.status(401).send(newResponse(null,"Username already in use"));
    
    const success = await createUser(firstName,lastName,username,email,address,password);
    const outPayload = success ? newResponse(user) : newResponse(null,'Failed to create user.');
    res.status(success ? 200 : 402).send(outPayload);
}

const newResponse = (data: any, msg?:string, encString:boolean = false) => {
    if(data) data = encString ? 
            securityService.encryptString(data) : 
            securityService.encryptJson(data);
    return {
        success: data != null,
        data: data,
        message: msg || ''
    };
}

const usersController = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    login,
    signup
}; export { usersController };