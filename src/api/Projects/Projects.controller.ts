import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../Users/User.model";
import { transporter, projectCreated } from "../../utils/mailer";
import { RequestWithUserId } from "../../utils/auth";
import { adminVerification } from "../Users/User.controller";
import Project, { IProject } from "./Projects.model";

export async function create(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = await adminVerification(req.userId as string);
    const { name, startDate } = req.body;
    const newProject = {
      name,
      startDate,
    };
    const project: IProject = await Project.create(newProject);
    await transporter.sendMail(projectCreated(userAuthId,name,startDate));
    res.status(201).json({
        message:"Project created successfully",
        data:{name,startDate},
    });
  } catch (err:any) {
    res.status(400).json({message:"Project could not be created", error:err.message});
  }
}
