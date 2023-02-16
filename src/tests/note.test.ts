import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import config from "../config/config";
import User from "../models/userModel";
import Note from "../models/noteModel";
import dummyData from "../utils/dummyData";

describe("Note", () => {
  let token: string;
  let note: any;
  beforeAll(async () => {
    try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(config.test.database);
      console.log("connected to db");

      const res = await request(app)
        .post("/api/v1/users/signup")
        .send(dummyData.users.user1);
      token = res.body.token;
      console.log("token gotten");
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    const res = await request(app)
      .post("/api/v1/notes")
      .send(dummyData.notes.note1)
      .set("Authorization", `Bearer ${token}`);
    note = res.body.data.note;
  });

  afterEach(async () => {
    await Note.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    mongoose.connection.close();
  });

  it("should create a note", async () => {
    const res = await request(app)
      .post("/api/v1/notes")
      .send(dummyData.notes.note2)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.note).toHaveProperty("title");
    expect(res.body.data.note).toHaveProperty("body");
  });
  it("should get a note", async () => {
    const res = await request(app)
      .get(`/api/v1/notes/${note.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.note).toHaveProperty("title");
    expect(res.body.data.note).toHaveProperty("body");
  });
  it("should get all notes", async () => {
    const res = await request(app)
      .get(`/api/v1/notes/`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.results).toBeDefined();
    expect(res.body.data.notes).toBeInstanceOf(Array);
  });

  it("should update a note", async () => {
    const res = await request(app)
      .patch(`/api/v1/notes/${note.id}`)
      .send(dummyData.notes.note2)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.updatedNote.title).toBe(dummyData.notes.note2.title);
    expect(res.body.data.updatedNote.body).toBe(dummyData.notes.note2.body);
    expect(res.body.status).toBe("success");
    expect(res.body.data.updatedNote).toHaveProperty("title");
    expect(res.body.data.updatedNote).toHaveProperty("body");
  });

  it("should delete a note", async () => {
    const res = await request(app)
      .delete(`/api/v1/notes/${note.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});
