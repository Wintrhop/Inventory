import { Router } from "express";
import {create, listAll,show} from "./Files.controller";
import { auth } from "../../utils/auth";
import { upload, s3upload } from "../../utils/s3aws";

const router = Router();
// router.route("/create/:projectId").post(auth, upload(process.env.S3_BUCKETNAME as string).single('file'),create);
router.route("/create/:projectId").post(auth, s3upload,create);
router.route("/").get(auth,listAll);
router.route("/:fileId").get(auth,show);
export default router;