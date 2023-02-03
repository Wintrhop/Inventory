import { Request, Response, NextFunction } from "express";
import User, { IUser } from "./User.model";
import { transporter, welcome } from "../../utils/mailer";
import { RequestWithUserId } from "../../utils/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const passwordRegex = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
);

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body;
    if (!passwordRegex.test(password)) {
      throw new Error(`Password must have at least 8 characters, At least one upper case,
        At least one lower case, At least one digit, At least one special character`);
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("Email already exist");
    }
    const encPassword: string = await bcrypt.hash(password, 8);
    const newUser={
        name,
        email,
        password:encPassword,
        role:"client"
    };
    const user: IUser = await User.create(newUser);
    const token: string = jwt.sign(
        { id: user._id },
        process.env.SECRET_KEY as string,
        {
          expiresIn: 60 * 60 * 24,
        }
      );
      const role = user.role;
      
  
      await transporter.sendMail(welcome(newUser,password));
      res.status(201).json({
        message: "user created successfully",
        data: { name, email, token, role },
      });
  } catch (err: any) {
    res
      .status(400)
      .json({ message: "user could not be register", error: err.message });
  }
}
