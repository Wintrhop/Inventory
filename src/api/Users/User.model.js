"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        match: [emailRegex, "You must enter a valid email example@example.com"],
        required: [true, "Please Enter an Email"],
    },
    password: {
        type: String,
        required: [true, "You should enter a password"],
    },
    org: {
        type: String,
        required: [true, "Please enter an Org"],
    },
    role: {
        type: String,
        required: true,
        enum: {
            values: ["admin", "support", "client", "projectWorker"],
            message: "Invalid role",
        },
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Project"
    },
    files: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "File" }],
        required: false,
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("User", userSchema);
