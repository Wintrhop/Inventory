import { Request, Response, NextFunction } from "express";

import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

new AWS.S3()

