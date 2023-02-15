import { NextFunction, Request, Response } from "express";

import AppError, { Err } from "../utils/AppError";

const sendErrDev = (err: any, res: Response) => {
  // console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    res.status(err.statusCode).json({
      status: err.status,
      message: "Something went very wrong",
    });
  }
};
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};
const handleDuplicateFieldsError = (err: any) => {
  const message = `${err.keyValue.name} already exists in database, please use another value`;
  return new AppError(message, 400);
};
const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((val: any) => val.message);
  const message = `Invalid input data: ${errors.join("; ")}`;
  return new AppError(message, 401);
};
export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV !== "production") {
    console.log(err);
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsError(err);
    if (err.name === "ValidationError") {
      error = handleValidationError(err);
    }
    sendErrProd(error, res);
  }
};
