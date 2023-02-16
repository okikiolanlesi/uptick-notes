import express from "express";
import {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController";

import { protect } from "../controllers/authController";
const router = express.Router();
router.use(protect);

router.route("/").get(getAllNotes).post(createNote);

router.route("/:id").get(getNote).patch(updateNote).delete(deleteNote);

export default router;
