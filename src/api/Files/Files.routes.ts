import { Router } from "express";
import {create} from "./Files.controller";
import { auth } from "../../utils/auth";
import { s3upload } from "../../utils/s3aws";

const router = Router();
router.route("/create/:projectId").post(auth, s3upload,create);


export default router;