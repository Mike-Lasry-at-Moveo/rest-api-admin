import mongoose from "mongoose";
import { securityService } from "../services/security";

interface IUser {
    _id?: String,
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    address: String,
    hash?: String,
    salt?: String,
    role?: String
} 

interface IUserDocument extends mongoose.Document<IUser> {
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    address: String,
    hash: String,
    salt: String,
    role: String
}

interface IUserModel extends mongoose.Model<IUserDocument> {
    build(attr: IUser, password: string): IUser;
    findAll(): Promise<IUserDocument[]>;
    add(user: IUser): Promise<IUserDocument>
    change(userId: string, key: String, value: String): Promise<any>;
    delete(userId: string): Promise<any>;
    getById(userId: string): Promise<any>;
    getByUsername(username: string): any;
    // validatePassword(password: string): boolean;
}

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    email: { type: String },
    address: { type: String },
    salt: { type: String },
    hash: { type: String },
    role: {type: String, default: "client"}
});

// Schema functions
userSchema.statics.build = (attr: IUser, password: string) => {
    const user = new User(attr);
    user.salt = genSalt();
    user.hash = genHash(password, user.salt as string);
    return user;
}

userSchema.statics.findAll = async (): Promise<IUserDocument[]>=> {
    let response: IUserDocument[] = [];
    try {
        response = await User.find();
    } catch (error) {
        console.error.bind("error");
    } finally { return response; }
};

userSchema.statics.getById = async (id: string): Promise<any>=> {
    let response = { } as any;
    try {
        response = await User.findById(id)
    } catch (error) {
        console.error.bind("error: ");
    } finally { return response; }
};

userSchema.statics.getByUsername = async (username: string): Promise<any>=> {
    let response = { } as any;
    try {
        response = await User.find({"username": username});
    } catch (error) {
        console.error.bind("error: ");
    } finally { return response; }
};

userSchema.statics.add = async (user: IUserDocument): Promise<IUserDocument> => {
    let response = {} as IUserDocument;
     try{
         response = await User.create(user);
     } catch (error) {
         console.error.bind(`Error occured trying to add a new user:\n${user}`); 
         response = {} as IUserDocument;        
     } finally { return response; }
};

userSchema.statics.change = async (userId: string, key: String, value: String): Promise<any> => {    
    let response = {} as any;
    try {
        response = await User.updateOne( {_id: userId}, {$set: {...getUpdate(key, value)}} );
    } catch (error) {
        console.error.bind(`Error occured trying to change a user: ${userId}`);
    } finally { return response };
};

userSchema.statics.delete = async (userId: String): Promise<any> => {
    let response = { } as any;
    try{
        response = await User.deleteOne({_id: userId});
    } catch (error) {
        console.error.bind(`Error occured trying to delete user: ${userId}:\n`);
    } finally { return response; }
}; 

// User methods
userSchema.methods.validatePassword = function(suppliedPassword: string): boolean {
    return this.hash === genHash(suppliedPassword, this.salt);
}

userSchema.methods.setPassword = function(password: string): void { // bind
    this.salt = genSalt();
    this.hash = genHash(password, this.salt);
}




const User = mongoose.model<IUserDocument, IUserModel>(`User`, userSchema);
export { User, IUser, IUserDocument };

// Util functions

function getUpdate(key:String, value: String){
    switch (key){
        case "firstName":   return { firstName: value };
        case "lastName":    return { lastName: value };
        case "username":    return { username: value };
        case "email":       return { email: value };
        case "address":     return { address: value };
        case "hash":        return { hash: value };
        case "salt":        return { salt: value };
        case "role":        return { role: value };
        default:            return null;
    }
}

function genSalt(){
    return securityService.generateSalt()
}

function genHash(password: string, salt: string){
    return securityService.hashPassword(password, salt);
}