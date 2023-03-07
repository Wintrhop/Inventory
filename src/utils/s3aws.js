"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3upload = exports.upload = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const s3 = new client_s3_1.S3Client({
    region: process.env.S3_BUCKETREGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESKEYID,
        secretAccessKey: process.env.S3_SECRETACCES,
    },
});
const upload = (bucketName) => (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3,
        bucket: bucketName,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
});
exports.upload = upload;
const s3upload = (req, res, next) => {
    const uploadSingle = (0, exports.upload)(process.env.S3_BUCKETNAME).single("file");
    uploadSingle(req, res, () => {
        const data = req.body;
        const reqFile = req.file;
        if (reqFile === undefined)
            throw new Error("file undefined");
        if (reqFile.location === undefined)
            throw new Error("location undefined");
        req.body = Object.assign(Object.assign({}, data), { file: reqFile.location });
        next();
    });
};
exports.s3upload = s3upload;
