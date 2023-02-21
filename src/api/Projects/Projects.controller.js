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
exports.create = void 0;
const mailer_1 = require("../../utils/mailer");
const User_controller_1 = require("../Users/User.controller");
const Projects_model_1 = __importDefault(require("./Projects.model"));
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = yield (0, User_controller_1.adminVerification)(req.userId);
            const { name, startDate } = req.body;
            const newProject = {
                name,
                startDate,
            };
            const project = yield Projects_model_1.default.create(newProject);
            console.log(userAuthId);
            yield mailer_1.transporter.sendMail((0, mailer_1.projectCreated)(userAuthId, name, startDate));
            res.status(201).json({
                message: "Project created successfully",
                data: { name, startDate },
            });
        }
        catch (err) {
            res.status(400).json({ message: "Project could not be created", error: err.message });
        }
    });
}
exports.create = create;
