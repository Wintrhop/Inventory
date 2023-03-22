import { Request, Response, NextFunction } from "express";

import { RequestWithUserId } from "../../utils/auth";
import { adminVerification, userFinder } from "../Users/User.controller";
import Project, { IProject } from "../Projects/Projects.model";
import User, { IUser } from "../Users/User.model";
import File, { IFile } from "../Files/Files.model";
import { elementExist, userAllowed } from "../Projects/Projects.controller";



export async function create(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = await userFinder(req.userId as string);
    const { projectId } = req.params;
    const data = req.body;
    const project = await elementExist(projectId as string, Project);

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

export async function listAll(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = await adminVerification(
      req.userId as string,
      "adminAndSupport"
    );

    const files = await File.find().populate({
      path: "user",
      select: "-_id email",
    });
    if (files.length === 0) {
      throw new Error("Files empty");
    }
    res.status(201).json({ message: "Files found", data: files });
  } catch (err: any) {
    res.status(404).json({ message: "Error", error: err.message });
  }
}
export async function show(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
):Promise<void>{
  try {
    const userAuthId = await userFinder(req.userId as string);
    const { fileId } = req.params;
    
    const file = await elementExist(fileId as string, File);
    if (!file?._id) {
      throw new Error("File not found");
    }
    if (userAuthId.role !== "admin") {
      if (userAuthId.role !== "support") {
        userAllowed(userAuthId.files, file._id as string);
      }
    }

    const fileShow =  await file
    .populate([{
      path: "user",
      select: "-_id email org",
    },
  {
    path:"project",
    select:"-files -users"
  }])
    
    res.status(201).json({ message: "File found", data: fileShow });
  } catch (err: any) {
    res.status(400).json({ message: "error", error: err.message });
  }
};
