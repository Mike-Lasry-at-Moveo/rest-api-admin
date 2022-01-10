import signJWT from "../middleware/signJWT";
import { User, IUserDocument, IUser } from "../models/user"
import { securityService } from "../services/security";

const getUsers = async (): Promise<IUserDocument[]> => {
    return await User.findAll();
}

const getUserById = async (id: string): Promise<IUserDocument> => {
    return await User.getById(id);
}

const getUserByUsername = async (username: string): Promise<IUserDocument[]> => {
    return await User.getByUsername(username);
}

const createUser = async (user: IUser, password: string): Promise<IUserDocument> => { // change name to signup
    return await User.add(User.build(user, password));   
};

const updateUser = async (restaurantId: string, key: string, value: string): Promise<IUserDocument> => {
    return await User.change(restaurantId, key, value);
};

const deleteUser = async (_id: string): Promise<IUserDocument> => {
    return await User.delete(_id);
};

const login = async (username: string, password: string): Promise<any> => {
    const users = await User.getByUsername(username);
    if(!users || !users.length) {
        return false;
    }
    const userHash = users[0].hash;
    const providedHash = securityService.hashPassword(password, users[0].salt);
    let authenticated: boolean = userHash == providedHash;
    if(authenticated){
        return signJWT(users[0], (err,token) => jwtCallback(err, token));
    } else return "Can't sign token";
};

const jwtCallback = (error: any, token: any) => {
    return error ? error : token;
}

const usersService = { 
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUserByUsername,
    login,
};

export { usersService };