import db from "../config/db";
import { User } from "../models/user.model";
import request from "supertest";
import app from "../app";

beforeEach(async () => {
  await db.sync({ force: true });
});

afterAll(async () => {
  await db.close();
});

describe("User API", () => {
  const userData = { name: "User", email: "test@mail.com" };
  const secondUserData = { name: "User2", email: "test2@mail.com" };

  it("POST /users creates a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");

    const userInDb = await User.findByPk(response.body.id);
    expect(userInDb).not.toBeNull();
  });

  it("POST /users with invalid data returns 400", async () => {
    await request(app)
      .post("/users")
      .send({ name: "", email: "invalidemail" })
      .expect(400);
  });

  it("POST /users with missing data returns 400", async () => {
    await request(app).post("/users").send({}).expect(400);
  });

  it("POST /users with duplicate email returns 400", async () => {
    await User.create(userData);
    await request(app).post("/users").send(userData).expect(400);
  });

  it("GET /users/:id returns a user by ID", async () => {
    const user = await User.create(userData);

    const response = await request(app).get(`/users/${user.id}`).expect(200);

    expect(response.body.id).toBe(user.id);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
  });

  it("GET /users/:id with non-existing ID returns 404", async () => {
    await request(app).get("/users/999").expect(404);
  });

  it("GET /users/:id with invalid ID returns 400", async () => {
    await request(app).get("/users/invalid").expect(400);
  });

  it("GET /users returns list of users", async () => {
    const response = await request(app).get("/users");
    expect(response.body).toHaveLength(0);
    await User.create(userData);
    await User.create(secondUserData);
    const response2 = await request(app).get("/users");
    expect(response2.body).toHaveLength(2);
  });

  it("PUT /users/:id updates a user", async () => {
    const user = await User.create(userData);
    const response = await request(app)
      .put(`/users/${user.id}`)
      .send(secondUserData)
      .expect(201);

    expect(response.body.id).toBe(user.id);
    expect(response.body.name).toBe(secondUserData.name);
    expect(response.body.email).toBe(secondUserData.email);

    const updatedUserInDb = await User.findOne({ where: { id: user.id } });

    expect(updatedUserInDb?.name).toBe(secondUserData.name);
    expect(updatedUserInDb?.email).toBe(secondUserData.email);
  });

  it("DELETE /users/:id deletes a user", async () => {
    const user = await User.create(userData);
    await request(app).delete(`/users/${user.id}`).expect(204);

    const response = await request(app).get("/users");
    expect(response.body).toHaveLength(0);
  });

  it("DELETE /users/:id with non-existing ID returns 404", async () => {
    await User.create(userData);
    await request(app).delete("/users/999").expect(404);
  });
});
