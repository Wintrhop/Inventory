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

const upload = (bucketName:string) => 
    multer({
      storage: s3Storage({
        s3,
        bucket: bucketName ,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        contentType: s3Storage.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          cb(null, "hola.txt");
        },
      }),
    });

export const s3upload = (req: Request, res: Response, next: NextFunction) => {
  
    const uploadSingle= upload(process.env.S3_BUCKETNAME as string).single('file')
    
    next();
};
