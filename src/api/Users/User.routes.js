"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_controller_1 = require("./User.controller");
const auth_1 = require("../../utils/auth");
const router = (0, express_1.Router)();
router.route("/signUp").post(auth_1.auth, User_controller_1.register);
router.route("/logIn").post(User_controller_1.signIn);
router.route("/").get(auth_1.auth, User_controller_1.list);
router.route("/:email").put(auth_1.auth, User_controller_1.update);
// router.route("/").delete(auth, destroy);
exports.default = router;
