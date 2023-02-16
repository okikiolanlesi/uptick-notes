import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import User, { IUser } from "../models/userModel";
import jwt, { JwtPayload, SigningKeyCallback } from "jsonwebtoken";
import { promisify } from "util";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

export interface CustomRequest extends Request {
  user: IUser;
}

const signToken = (id: string) =>
  jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
const createSendToken = (
  res: Response,
  user: IUser,
  statusCode: number,
  req: Request
) => {
  const token = signToken(user._id);

  const cookieOptions: any = {
    maxAge: config.cookieExpiresIn * 60 * 60 * 1000,
    // httpOnly: true means that the cookie cannot be accessed or modified in any way by the browser
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
  if (req.secure || req.headers["x-forwarded-proto"] === "https")
    cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return next(new AppError("Please provide required details", 400));
    }
    const user = await User.create(req.body);

    createSendToken(res, user, 201, req);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new AppError("Invalid details", 401));

    const passwordCheck = await user.isCorrectPassword(
      password,
      user.password!
    );

    if (!passwordCheck) return next(new AppError("Invalid details", 401));

    createSendToken(res, user, 200, req);
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token and check if its there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access", 401)
      );
    }
    // 2. Verify token
    interface IDecoded extends JwtPayload {
      id?: string;
    }

    const jwtVerifyPromisified = (token: string, secret: string) => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {}, (err, payload) => {
          if (err) {
            reject(err);
          } else {
            resolve(payload);
          }
        });
      });
    };

    const decodedData: any = await jwtVerifyPromisified(
      token,
      config.jwt.secret
    );

    if (!decodedData) return next(new AppError("Invalid data", 401));

    const user = await User.findById((decodedData as IDecoded).id);

    if (!user) return next(new AppError("Please login", 401));

    // 3. save user to req.user
    (req as CustomRequest).user = user;

    next();
  }
);
