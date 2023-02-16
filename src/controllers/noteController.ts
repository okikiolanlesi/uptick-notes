import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import Note, { INote } from "../models/noteModel";
import { CustomRequest } from "./authController";
import { NextFunction, Response } from "express";
import { PopulatedDoc } from "mongoose";

export const getAllNotes = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const notes = await Note.find({ owner: req.user._id });

    res.status(200).json({
      status: "success",
      results: notes.length,
      data: {
        notes,
      },
    });
  }
);

export const createNote = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { title, body } = req.body;
    const noteToBeCreated = {
      title,
      body,
      owner: req.user._id,
    };
    const note = await Note.create(noteToBeCreated);
    res.status(201).json({
      status: "success",
      data: {
        note,
      },
    });
  }
);

export const getNote = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const note: PopulatedDoc<INote> = await Note.findById(id).populate("owner");

    if (!note) {
      return next(new AppError("No note found with this id", 404));
    }

    console.log(note.owner.id, req.user.id);
    if (note?.owner.id != req.user.id) {
      return next(new AppError("You are not authorized to get this note", 404));
    }
    note.owner = undefined;
    res.status(200).json({
      status: "success",
      data: {
        note,
      },
    });
  }
);

export const updateNote = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    delete req.body.owner;

    const updatedNote = await Note.findOneAndUpdate({
      $and: [{ id }, { owner: req.user._id }],
    });

    if (!updatedNote) {
      return next(new AppError("No note found with this id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        updatedNote,
      },
    });
  }
);

export const deleteNote = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    delete req.body.owner;

    const deletedNote = await Note.findOneAndDelete({
      $and: [{ id }, { owner: req.user._id }],
    });

    if (!deletedNote) {
      return next(new AppError("No note found with this id", 404));
    }

    res.status(204).json({
      status: "success",
      data: {
        deletedNote,
      },
    });
  }
);
