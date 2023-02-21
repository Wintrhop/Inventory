"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Projects_controller_1 = require("./Projects.controller");
const auth_1 = require("../../utils/auth");
const router = (0, express_1.Router)();
router.route("/create").post(auth_1.auth, Projects_controller_1.create);
exports.default = router;
