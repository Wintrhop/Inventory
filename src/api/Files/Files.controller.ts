import { Request,Response, NextFunction } from "express";
import User, {IUser} from "../Users/User.model";
import { RequestWithUserId } from "../../utils/auth";
import { adminVerification, userFinder } from "../Users/User.controller";
import Project, { IProject } from "../Projects/Projects.model";
import { projectExist } from "../Projects/Projects.controller";

export async function create(
    req: RequestWithUserId,
    res: Response,
    next: NextFunction
):Promise<void> {
    try {
        const userAuthId = await userFinder(req.userId as string);
        const {projectId} = req.params;
        const data = req.body;
        const project = await projectExist(projectId as string);
        
    } catch (err) {
        
    }
    
}