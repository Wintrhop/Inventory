import { S3Client } from "@aws-sdk/client-s3";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import s3Storage from "multer-s3";

const s3 = new S3Client({
  region: process.env.S3_BUCKETREGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESKEYID as string,
    secretAccessKey: process.env.S3_SECRETACCES as string,
  },
});

export const upload = (bucketName: string) =>
  multer({
    storage: s3Storage({
      s3,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      contentType: s3Storage.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
  });

export const s3upload = (req: Request, res: Response, next: NextFunction) => {
  const uploadSingle = upload(process.env.S3_BUCKETNAME as string).single(
    "file"
  );
  uploadSingle(req, res, () => {
    const data = req.body;
    const reqFile = req.file as any;
    if (reqFile === undefined) throw new Error("file undefined");
    if (reqFile.location === undefined) throw new Error("location undefined");

    console.log("body en s3upload");

    req.body = {
      ...data,
      file: reqFile.location,
    };
    next();
  });
  
};
