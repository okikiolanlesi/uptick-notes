import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import AppError from "./utils/AppError";
import globalErrorHandler from "./controllers/errorController";
import userRouter from "./routes/userRoutes";
import noteRouter from "./routes/noteRoutes";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

app.use(morgan("dev"));

const limiter = {
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again in an hour",
};
app.use(
  cors({
    origin: ["http://localhost:3000", "https://uptick-notes.netlify.app"],
    credentials: true,
  })
);
app.use(rateLimit(limiter));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", noteRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: "success",
    message: "Welcome to the uptick-notes API",
    linkToDocumentation: "",
  });
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError(`${req.url} does not exist on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
