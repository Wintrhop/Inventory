import { Request, Response, NextFunction } from "express";
import User, { IUser } from "./User.model";
import { transporter, welcome } from "../../utils/mailer";
import { RequestWithUserId } from "../../utils/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const passwordRegex = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
);
export const adminVerification = async (userId: string) => {
  const userAuth = await User.findById(userId);
  if (!userAuth) {
    throw new Error("Wrong Credentials");
  }
  if (userAuth.role !== "admin") {
    throw new Error("Wrong Role Credentials");
  }
  return userAuth;
};

export async function register(
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userAuthId = adminVerification(req.userId as string);

    const { name, email, password, role } = req.body;
    if (role === "admin") {
      throw new Error("Role Admin Cannot be Created");
    }
    if (!passwordRegex.test(password)) {
      throw new Error(`Password must have at least 8 characters, At least one upper case,
        At least one lower case, At least one digit, At least one special character`);
    }
    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new Error("Email already exist");
    }
    const encPassword: string = await bcrypt.hash(password, 8);
    const newUser = {
      name,
      email,
      password: encPassword,
      role,
    };
    const user: IUser = await User.create(newUser);
    const token: string = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY as string,
      {
        expiresIn: 60 * 60 * 24,
      }
    );
    const roleUser = user.role;

    await transporter.sendMail(welcome(newUser, password));
    res.status(201).json({
      message: "user created successfully",
      data: { name, email, token, roleUser },
    });
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "user could not be register", error: err.message });
  }
}

export async function signIn(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      throw new Error("Email or password invalid");
    }
    const isValid: boolean = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Email or password invalid");
    }
    const token: string = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY as string,
      {
        expiresIn: 60 * 60 * 24,
      }
    );

    const role = user.role;
    const name = user.name;
    
    res.status(201).json({
      message: "User Login Successfully",
      data: { name, email, role, token  },
    });
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "User could not login", error: err.message });
  }
}
