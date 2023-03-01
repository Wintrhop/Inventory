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
exports.show = exports.list = exports.update = exports.create = exports.userAllowed = exports.projectExist = void 0;
const User_model_1 = __importDefault(require("../Users/User.model"));
const mailer_1 = require("../../utils/mailer");
const User_controller_1 = require("../Users/User.controller");
const Projects_model_1 = __importDefault(require("./Projects.model"));
function projectExist(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const project = yield Projects_model_1.default.findById(projectId);
        if (!project) {
            throw new Error("Project not Found");
        }
        return project;
    });
}
exports.projectExist = projectExist;
function userAllowed(userProject, projectId) {
    if (userProject !== projectId)
        throw new Error("Invalid user");
}
exports.userAllowed = userAllowed;
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = yield (0, User_controller_1.adminVerification)(req.userId, "adminAndSupport");
            const { name, startDate } = req.body;
            const newProject = {
                name,
                startDate,
            };
            const project = yield Projects_model_1.default.create(newProject);
            yield mailer_1.transporter.sendMail((0, mailer_1.projectCreated)(userAuthId, name, startDate));
            res.status(201).json({
                message: "Project created successfully",
                data: { name, startDate },
            });
        }
        catch (err) {
            res
                .status(400)
                .json({ message: "Project could not be created", error: err.message });
        }
    });
}
exports.create = create;
function update(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = yield (0, User_controller_1.adminVerification)(req.userId, "admin");
            const { projectId } = req.params;
            const { users, endDate } = req.body;
            const usersError = new Array();
            const project = yield projectExist(projectId);
            if (!!endDate) {
                if (project.endDate !== undefined) {
                    throw new Error("project already ended");
                }
                project.endDate = endDate;
            }
            if (users.length > 0) {
                const newUsers = new Array();
                for (let i = 0; i < users.length; i++) {
                    const element = yield User_model_1.default.findOne({ email: users[i] });
                    if (!element) {
                        throw new Error("User not Found");
                    }
                    if (project.users.includes(element === null || element === void 0 ? void 0 : element._id)) {
                        usersError.push(element.email);
                        continue;
                    }
                    newUsers.push(element === null || element === void 0 ? void 0 : element._id);
                    element.project = project._id;
                    yield element.save({ validateBeforeSave: false });
                }
                if (project.users.length === 0) {
                    project.users = [...newUsers];
                }
                else {
                    const prevUsers = project.users;
                    const allUsers = [...prevUsers, ...newUsers];
                    project.users = allUsers;
                }
            }
            yield project.save({ validateBeforeSave: false });
            if (usersError.length === users.length) {
                throw new Error("Users already in project");
            }
            if (!!usersError[0]) {
                res.status(201).json({
                    message: "Project updated but some users cannot aggregate",
                    data: { Error: usersError, Project: project._id },
                });
            }
            else {
                res.status(201).json({ message: "Project updated", data: project._id });
            }
        }
        catch (err) {
            res.status(400).json({
                message: "Project could not be updated",
                error: err.message,
            });
        }
    });
}
exports.update = update;
function list(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = yield (0, User_controller_1.adminVerification)(req.userId, "adminAndSupport");
            const projects = yield Projects_model_1.default.find(); //.select("-users");
            if (projects.length === 0) {
                throw new Error("Projects empty");
            }
            res.status(201).json({ message: "Projects found", data: projects });
        }
        catch (err) {
            res.status(404).json({ message: "Error", error: err.message });
        }
    });
}
exports.list = list;
function show(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = yield (0, User_controller_1.userFinder)(req.userId);
            const { projectId } = req.params;
            const project = yield projectExist(projectId);
            if (!(project === null || project === void 0 ? void 0 : project._id)) {
                throw new Error("Project not found");
            }
            if (userAuthId.role === "projectWorker" || userAuthId.role === "client") {
                if (!project.users.includes(userAuthId._id)) {
                    throw new Error("Invalid user");
                }
            }
            const projectShow = yield Projects_model_1.default.findById(projectId).populate({
                path: "users",
                select: "-_id -password",
            });
            res.status(201).json({ message: "Project found", data: projectShow });
        }
        catch (err) {
            res.status(400).json({ message: "error", error: err.message });
        }
    });
}
exports.show = show;
