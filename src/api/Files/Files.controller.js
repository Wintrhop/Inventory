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
exports.show = exports.listAll = exports.create = void 0;
const User_controller_1 = require("../Users/User.controller");
const Projects_model_1 = __importDefault(require("../Projects/Projects.model"));
const Files_model_1 = __importDefault(require("../Files/Files.model"));
const Projects_controller_1 = require("../Projects/Projects.controller");
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = yield (0, User_controller_1.userFinder)(req.userId);
            const { projectId } = req.params;
            const data = req.body;
            const project = yield (0, Projects_controller_1.elementExist)(projectId, Projects_model_1.default);
            if (userAuthId.role === "client") {
                throw new Error("Clients not allowed to create files");
            }
            if (userAuthId.role !== "admin") {
                if (userAuthId.role !== "support") {
                    (0, Projects_controller_1.userAllowed)(userAuthId.project, projectId);
                }
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
function listAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = yield (0, User_controller_1.adminVerification)(req.userId, "adminAndSupport");
            const files = yield Files_model_1.default.find().populate({
                path: "user",
                select: "-_id email",
            });
            if (files.length === 0) {
                throw new Error("Files empty");
            }
            res.status(201).json({ message: "Files found", data: files });
        }
        catch (err) {
            res.status(404).json({ message: "Error", error: err.message });
        }
    });
}
exports.listAll = listAll;
function show(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = yield (0, User_controller_1.userFinder)(req.userId);
            const { fileId } = req.params;
            const file = yield (0, Projects_controller_1.elementExist)(fileId, Files_model_1.default);
            if (!(file === null || file === void 0 ? void 0 : file._id)) {
                throw new Error("File not found");
            }
            if (userAuthId.role !== "admin") {
                if (userAuthId.role !== "support") {
                    (0, Projects_controller_1.userAllowed)(userAuthId.files, file._id);
                }
            }
            const fileShow = yield file
                .populate([{
                    path: "user",
                    select: "-_id email org",
                },
                {
                    path: "project",
                    select: "-files -users"
                }]);
            res.status(201).json({ message: "File found", data: fileShow });
        }
        catch (err) {
            res.status(400).json({ message: "error", error: err.message });
        }
    });
}
exports.show = show;
;
