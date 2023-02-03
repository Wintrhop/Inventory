import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoute from "./api/Users/User.routes"


const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.use("/auth/local",userRoute);

export default app;
