"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: false },
    files: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "File" }],
        required: false,
    },
    users: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
        required: false,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Project", projectSchema);
