import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../Users/User.model";
import { transporter, welcome } from "../../utils/mailer";
import { RequestWithUserId } from "../../utils/auth";
import { adminVerification } from "../Users/User.controller";

export async function create(
    req: RequestWithUserId,
    res: Response,
    next:NextFunction
):Promise<void>{
    try {
        const userAuthId = adminVerification(req.userId as string);
        const {name, startDate, }
    } catch (err) {
        
    }
}