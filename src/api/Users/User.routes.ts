import { Router } from "express";
import { register } from "./User.controller";
import {auth} from "../../utils/auth"

const router = Router()

router.route("/signUp").post(register);
// router.route("/logIn").post(signIn);
// router.route("/").get(auth,list);
// router.route("/").put(auth,update);
// router.route("/").delete(auth, destroy);

export default router