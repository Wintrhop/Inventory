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
exports.register = void 0;
const User_model_1 = __importDefault(require("./User.model"));
const mailer_1 = require("../../utils/mailer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            if (!passwordRegex.test(password)) {
                throw new Error(`Password must have at least 8 characters, At least one upper case,
        At least one lower case, At least one digit, At least one special character`);
            }
            const userExist = yield User_model_1.default.findOne({ email });
            if (userExist) {
                throw new Error("Email already exist");
            }
            const encPassword = yield bcrypt_1.default.hash(password, 8);
            const newUser = {
                name,
                email,
                password: encPassword,
                role: "client"
            };
            const user = yield User_model_1.default.create(newUser);
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.SECRET_KEY, {
                expiresIn: 60 * 60 * 24,
            });
            const role = user.role;
            yield mailer_1.transporter.sendMail((0, mailer_1.welcome)(newUser, password));
            res.status(201).json({
                message: "user created successfully",
                data: { name, email, token, role },
            });
        }
        catch (err) {
            res
                .status(400)
                .json({ message: "user could not be register", error: err.message });
        }
    });
}
exports.register = register;
