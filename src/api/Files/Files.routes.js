"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Files_controller_1 = require("./Files.controller");
const auth_1 = require("../../utils/auth");
const s3aws_1 = require("../../utils/s3aws");
const router = (0, express_1.Router)();
// router.route("/create/:projectId").post(auth, upload(process.env.S3_BUCKETNAME as string).single('file'),create);
router.route("/create/:projectId").post(auth_1.auth, s3aws_1.s3upload, Files_controller_1.create);
router.route("/").get(auth_1.auth, Files_controller_1.listAll);
exports.default = router;
