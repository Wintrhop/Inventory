"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.create = void 0;
const User_controller_1 = require("../Users/User.controller");
const Files_model_1 = __importDefault(require("../Files/Files.model"));
const Projects_controller_1 = require("../Projects/Projects.controller");
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = yield (0, User_controller_1.userFinder)(req.userId);
            const { projectId } = req.params;
            const data = req.body;
            const project = yield (0, Projects_controller_1.projectExist)(projectId);
            if (userAuthId.role === "client") {
                throw new Error("Clients not allowed to create files");
            }
            if (userAuthId.role !== "admin" || "support") {
                (0, Projects_controller_1.userAllowed)(userAuthId.project, projectId);
            }
            const newFile = Object.assign(Object.assign({}, data), { user: userAuthId._id, project: project._id });
            const fileCreate = yield Files_model_1.default.create(newFile);
            userAuthId.files.push(fileCreate._id);
            project.files.push(fileCreate._id);
            yield userAuthId.save({ validateBeforeSave: false });
            yield project.save({ validateBeforeSave: false });
            res.status(201).json({ message: "File Created", data: data });
        }
        catch (err) {
            res.status(400).json({
                message: "File could not be created",
                error: err.message,
            });
        }
    });
}
exports.create = create;
function list(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
        }
        catch (error) {
        }
    });
}
exports.list = list;
