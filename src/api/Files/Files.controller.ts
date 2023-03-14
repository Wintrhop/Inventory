import { Request, Response, NextFunction } from "express";

import { RequestWithUserId } from "../../utils/auth";
import { adminVerification, userFinder } from "../Users/User.controller";
import Project, { IProject } from "../Projects/Projects.model";
import User, { IUser } from "../Users/User.model";
import File, { IFile } from "../Files/Files.model";
import { projectExist, userAllowed } from "../Projects/Projects.controller";

export async function create(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = await userFinder(req.userId as string);
    const { projectId } = req.params;
    const data = req.body;
    const project = await projectExist(projectId as string);

    if (userAuthId.role === "client") {
      throw new Error("Clients not allowed to create files");
    }

    if (userAuthId.role !== "admin") {
      if (userAuthId.role !== "support") {
        
        userAllowed(userAuthId.project as string, projectId as string);
      }
    }
    const newFile = {
      ...data,
      user: userAuthId._id,
      project: project._id,
    };
    const fileCreate = await File.create(newFile);
    userAuthId.files.push(fileCreate._id);
    project.files.push(fileCreate._id);
    await userAuthId.save({ validateBeforeSave: false });
    await project.save({ validateBeforeSave: false });
    res.status(201).json({ message: "File Created", data: data });
  } catch (err: any) {
    res.status(400).json({
      message: "File could not be created",
      error: err.message,
    });
  }
}

export async function list(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
  } catch (error) {}
}
