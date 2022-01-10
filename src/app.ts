import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import { usersRouter } from "./routes/user"
import { restaurantsRouter } from "./routes/restaurant"

import { json } from "body-parser";
import { securityService } from "./services/security";

const appPort = 3500;
const dbPort = 27017;
const dbName = "moveo_skills"

const app = express();
app.use(json());
app.use(cors());

app.use(restaurantsRouter);
app.use(usersRouter);

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", console.error.bind("Failed to connect to MongoDB"));
mongoose.connect(`mongodb://127.0.0.1:${dbPort}/${dbName}`);
app.listen(appPort, () => console.log(`Connected to server on port ${appPort}`));

// import { securityService } from "./services/security";
// let str: string = "1234";
// console.log(securityService.encryptData(str));
//securityService.decrypt