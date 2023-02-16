import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import config from "../config/config";
import User from "../models/userModel";
import dummyData from "../utils/dummyData";

describe("Auth", () => {
  beforeAll(async () => {
    try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(config.test.database);
      console.log("connected to db");
    } catch (err) {
      console.log(err);
    }
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    mongoose.connection.close();
  });

  it("should signup a user", async () => {
    const res = await request(app)
      .post("/api/v1/users/signup")
      .send(dummyData.users.user2);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.user).toHaveProperty("email");
    expect(res.body.data.user).toHaveProperty("firstName");
    expect(res.body.data.user).toHaveProperty("lastName");
    expect(res.body.data.user).not.toHaveProperty("password");
  });

  it("should login a user", async () => {
    await User.create(dummyData.users.user1);

    const res = await request(app).post("/api/v1/users/login").send({
      email: dummyData.users.user1.email,
      password: dummyData.users.user1.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.user).toHaveProperty("email");
    expect(res.body.data.user).toHaveProperty("firstName");
    expect(res.body.data.user).toHaveProperty("lastName");
    expect(res.body.data.user).not.toHaveProperty("password");
  });
});
