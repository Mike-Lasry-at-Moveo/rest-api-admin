import { usersController } from "../controllers/user";
import { Router } from "express";
import extractJWT from "../middleware/extractJWT";

enum Path { 
    USERS_PATH = "/api/users",
    ID_PARAM = ":id",
    LOGIN = "login",
    SIGNUP = "signup",
    VALIDATE = "validate"
};


const router = Router();

router
    .get(Path.USERS_PATH, usersController.getAllUsers)
    .get(`${Path.USERS_PATH}/${Path.ID_PARAM}`, extractJWT, usersController.getUserById)
    // .get(`${Path.USERS_PATH}/${Path.VALIDATE}`, usersController.validateToken)

    .post(`${Path.USERS_PATH}/${Path.LOGIN}`, usersController.login)
    .post(Path.USERS_PATH, usersController.createUser)

    .patch(`${Path.USERS_PATH}/${Path.ID_PARAM}`, usersController.updateUser)
    .delete(`${Path.USERS_PATH}/${Path.ID_PARAM}`, usersController.deleteUser);

export { router as usersRouter };

