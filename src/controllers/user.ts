import { Response, Request, NextFunction } from "express";
import signJWT from "../middleware/signJWT";
import { User } from "../models/user";
import { securityService } from "../services/security";
import { usersService } from "../services/user";
// const validateToken = (req: Request, res: Response, next: NextFunction) => {
//     res.status(200).send("authenticated");
// }

const getAllUsers = async (req: Request, res: Response) => {
    const Users = await usersService.getUsers();
    res.status(201).send({success:true, data:Users});
};

const getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await usersService.getUserById(id);
    res.status(201).send({success:true, message:"get user by id cntrlr", data: user});
};

const createUser = async (req: Request, res: Response) => {
    const { firstName,lastName,username,email,address,password } = req.body;
    const User = await usersService.createUser({ firstName,lastName,username,email,address }, password);
    res.status(201).send(User);
};

const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const {key, value} = req.body;
    const User = await usersService.updateUser(id, key, value);
    res.status(201).send(User);
};

const deleteUser = async (req: Request, res: Response) => {
    const success = await usersService.deleteUser(req.params.id);
    res.status(201).send(success);
};

const login = async (req: Request, res: Response) => {
    console.log(`in login cntrllr`);
    
    let response = { } as any;
    const { username, password } = req.body;
    
    // const auth = await usersService.login(username, password);

    // <--
    const users = await User.getByUsername(username);
    if(!users || !users.length) 
        return res.status(404).json({success: false, message: "can't fins users:", data: users});
    
    const userHash = users[0].hash;
    const providedHash = securityService.hashPassword(password, users[0].salt);
    let authenticated: boolean = userHash == providedHash;
    console.log("password match:", authenticated);

    if(authenticated){
        signJWT(users[0], (err,token) => {
            let status: number = err ? 500 : 200;
            let success:boolean = err ? false : true;
            let message: string | null = success ? token : null;
            res.status(status).json({success:success, message: message});
            return;
        });
    } else res.status(500).json({success: false, message:"Can't sign token", data: null});
    // -->

    // response.success = auth != null;
    // response.data = auth ? "Logged in" : "Not valid";
    // res.status(200).send(response);
}

const signup = async (req: Request, res: Response) => {
    console.log("in signup usr cntrlr");
    let response = { } as any;
    const { username } = req.body.username;
    const userTaken = await usersService.getUserByUsername(username);
    
    if(userTaken) {
        response.success = false;
        response.data = "Username already in use";
        res.status(400).send(response);
    } else createUser(req, res);
}

const usersController = {
    // validateToken,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    login,
    signup
}; export { usersController };