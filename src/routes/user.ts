import { usersController } from "../controllers/user";
import { Router } from "express";
import extractJWT from "../middleware/extractJWT";

enum Path {
    USERS_PATH = "/api/users",
    ID_PARAM = ":id",
    LOGIN = "login",
    SIGNUP = "signup",
    VALIDATE = "validate",
    LOGIN_SFX = "login"
};

const router = Router();

router
    .get(Path.USERS_PATH, extractJWT, usersController.getAllUsers)
    .get(`${Path.USERS_PATH}/${Path.ID_PARAM}`, usersController.getUserById)

    .post(`${Path.USERS_PATH}/${Path.LOGIN_SFX}`, usersController.login)
    .post(Path.USERS_PATH, usersController.signup)

    .patch(`${Path.USERS_PATH}/${Path.ID_PARAM}`, usersController.updateUser)
    .delete(`${Path.USERS_PATH}/${Path.ID_PARAM}`, usersController.deleteUser);

export { router as usersRouter };