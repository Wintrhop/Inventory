import { Router } from "express";
import { register, signIn, list, update } from "./User.controller";
import { auth } from "../../utils/auth";

const router = Router();

router.route("/signUp").post(auth, register);
router.route("/logIn").post(signIn);
router.route("/").get(auth,list);
router.route("/:email").put(auth,update);
// router.route("/").delete(auth, destroy);

export default router;
