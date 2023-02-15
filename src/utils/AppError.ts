export interface Err {
  statusCode: number;
  message: string;
  status: string;
  isOperational: boolean;
}

class AppError extends Error implements Err {
  public statusCode: number;
  public status;
  public isOperational;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default AppError;
