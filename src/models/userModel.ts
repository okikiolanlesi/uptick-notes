import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  isCorrectPassword(candidatePassword: string, password: string): boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: [true, "Please tell us your first name!"],
    trim: true,
    maxlength: [
      20,
      "A user first name must have less than or equal to 40 characters",
    ],
  },
  lastName: {
    type: String,
    required: [true, "Please tell us your last name!"],
    trim: true,
    maxlength: [
      20,
      "A user last name must have less than or equal to 40 characters",
    ],
  },
  email: {
    type: String,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    required: [true, "Please provide your email"],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "Please provide a password"],
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (
  candidatePassword: string,
  password: string
) {
  return await bcrypt.compare(candidatePassword, password);
};

const User: Model<IUser> = mongoose.model("User", userSchema);

export default User;
