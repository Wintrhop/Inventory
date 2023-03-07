import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoute from "./api/Users/User.routes"
import fileRoute from "./api/Files/Files.routes"
import projectRoute from "./api/Projects/Projects.routes"
import {swaggerDoc} from "./swagger";


const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
swaggerDoc(app);

app.use("/auth/local",userRoute);
app.use("/api/projects",projectRoute);
app.use("/api/file",fileRoute);

export default app;
