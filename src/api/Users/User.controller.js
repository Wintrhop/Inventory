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
exports.update = exports.list = exports.signIn = exports.register = exports.adminVerification = void 0;
const User_model_1 = __importDefault(require("./User.model"));
const mailer_1 = require("../../utils/mailer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
const adminVerification = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth = yield User_model_1.default.findById(userId);
    if (!userAuth) {
        throw new Error("Wrong Credentials");
    }
    if (userAuth.role !== "admin") {
        throw new Error("Wrong Role Credentials");
    }
    return userAuth;
});
exports.adminVerification = adminVerification;
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = (0, exports.adminVerification)(req.userId);
            const { name, email, password, role } = req.body;
            if (role === "admin") {
                throw new Error("Role Admin Cannot be Created");
            }
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
                role,
            };
            const user = yield User_model_1.default.create(newUser);
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.SECRET_KEY, {
                expiresIn: 60 * 60 * 24,
            });
            const roleUser = user.role;
            yield mailer_1.transporter.sendMail((0, mailer_1.welcome)(newUser, password));
            res.status(201).json({
                message: "user created successfully",
                data: { name, email, token, roleUser },
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
function signIn(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield User_model_1.default.findOne({ email });
            if (!user) {
                throw new Error("Email or password invalid");
            }
            const isValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isValid) {
                throw new Error("Email or password invalid");
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.SECRET_KEY, {
                expiresIn: 60 * 60 * 24,
            });
            const role = user.role;
            const name = user.name;
            res.status(201).json({
                message: "User Login Successfully",
                data: { name, email, role, token },
            });
        }
        catch (err) {
            res
                .status(400)
                .json({ message: "User could not login", error: err.message });
        }
    });
}
exports.signIn = signIn;
function list(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = (0, exports.adminVerification)(req.userId);
            const users = yield User_model_1.default.find().select("-_id -password");
            if (users.length === 0) {
                throw new Error("Users empty");
            }
            res.status(201).json({ message: "Users found", data: users });
        }
        catch (err) {
            res.status(404).json({ message: "Error", error: err.message });
        }
    });
}
exports.list = list;
function update(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userAuthId = (0, exports.adminVerification)(req.userId);
            const { email } = req.params;
            const data = req.body;
            const user = yield User_model_1.default.findOne({ email }).select("-password");
            if (!user) {
                throw new Error("User not found");
            }
            if (!data) {
                throw new Error("No data to Update");
            }
            console.log(data.role); //TO DO: no guarda copia del objeto project
            const opts = { runValidators: true };
            const userUpdate = yield User_model_1.default.findByIdAndUpdate(user._id, data, opts);
            res.status(200).json({ message: "User Updated", data: data });
        }
        catch (err) {
            res
                .status(400)
                .json({ message: "User could not be Updated", error: err.message });
        }
    });
}
exports.update = update;
