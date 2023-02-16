import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import AppError from "./utils/AppError";
import globalErrorHandler from "./controllers/errorController";
import userRouter from "./routes/userRoutes";
import noteRouter from "./routes/noteRoutes";

const app = express();

app.use(morgan("dev"));

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
