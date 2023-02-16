import mongoose, { Schema, model, Document, Types, Model } from "mongoose";

export interface INote extends Document {
  owner: Types.ObjectId;
  title: string;
  body: string;
}

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, "Note must have a title"],
    },
    body: {
      type: String,
      required: [true, "Note must have a body"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Note: Model<INote> = model("Note", noteSchema);

export default Note;
