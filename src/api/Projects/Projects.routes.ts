import { Router } from "express";
import { create, update, list, show } from "./Projects.controller";
import { auth } from "../../utils/auth";
const router = Router();
router.route("/").post(auth, create);
router.route("/:projectId").put(auth, update);
router.route("/").get(auth, list);
router.route("/:projectId").get(auth,show);
export default router;
