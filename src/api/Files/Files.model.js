"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const fileSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: "Project", required: true },
    name: { type: String, required: true },
    file: { type: String, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("File", fileSchema);
