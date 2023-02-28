import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../Users/User.model";
import { transporter, projectCreated } from "../../utils/mailer";
import { RequestWithUserId } from "../../utils/auth";
import { adminVerification, userFinder } from "../Users/User.controller";
import Project, { IProject } from "./Projects.model";

export async function projectExist(projectId: string) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not Found");
  }
  return project;
}
export async function create(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = await adminVerification(
      req.userId as string,
      "adminAndSupport"
    );
    const { name, startDate } = req.body;
    const newProject = {
      name,
      startDate,
    };
    const project: IProject = await Project.create(newProject);
    await transporter.sendMail(projectCreated(userAuthId, name, startDate));
    res.status(201).json({
      message: "Project created successfully",
      data: { name, startDate },
    });
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "Project could not be created", error: err.message });
  }
}
export async function update(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = await adminVerification(req.userId as string, "admin");
    const { projectId } = req.params;
    const { users, endDate } = req.body;
    const usersError = new Array();
    const project = await projectExist(projectId as string);
    
    if (!!endDate) {
      if (project.endDate !== undefined) {
        throw new Error("project already ended");
      }
      project.endDate = endDate;
    }
    if (users.length > 0) {
      const newUsers = new Array();
      for (let i = 0; i < users.length; i++) {
        const element = await User.findOne({ email: users[i] });
        if (!element) {
          throw new Error("User not Found");
        }
        if (project.users.includes(element?._id)) {
          usersError.push(element.email);
          continue;
        }
        newUsers.push(element?._id);
        element.project = project._id;
        await element.save({ validateBeforeSave: false });
      }
      if (project.users.length === 0) {
        project.users = [...newUsers];
      } else {
        const prevUsers = project.users;
        const allUsers = [...prevUsers, ...newUsers];
        project.users = allUsers;
      }
    }
    await project.save({ validateBeforeSave: false });
    if (usersError.length === users.length) {
      throw new Error("Users already in project");
    }
    if (!!usersError[0]) {
      res.status(201).json({
        message: "Project updated but some users cannot aggregate",
        data: { Error: usersError, Project: project._id },
      });
    } else {
      res.status(201).json({ message: "Project updated", data: project._id });
    }
  } catch (err: any) {
    res.status(400).json({
      message: "Project could not be updated",
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
    const userAuthId = await adminVerification(
      req.userId as string,
      "adminAndSupport"
    );
    const projects = await Project.find(); //.select("-users");
    if (projects.length === 0) {
      throw new Error("Projects empty");
    }
    res.status(201).json({ message: "Projects found", data: projects });
  } catch (err: any) {
    res.status(404).json({ message: "Error", error: err.message });
  }
}
export async function show(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = await userFinder(req.userId as string);
    const { projectId } = req.params;
    const project = await projectExist(projectId as string);

    if (!project?._id) {
      throw new Error("Project not found");
    }
    if (userAuthId.role === "projectWorker" || userAuthId.role === "client") {
      if (!project.users.includes(userAuthId._id)) {
        throw new Error("Invalid user");
      }
    }
    const projectShow = await Project.findById(projectId).populate({
      path: "users",
      select: "-_id -password",
    });
    res.status(201).json({ message: "Project found", data: projectShow });
  } catch (err: any) {
    res.status(400).json({ message: "error", error: err.message });
  }
}
