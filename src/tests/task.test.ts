import db from "../config/db";
import { Task } from "../models/task.model";
import request from "supertest";
import app from "../app";
import { Status, Priority } from "../types/task.types";
import { User } from "../models/user.model";

const userData = { name: "Task User", email: "test@mail.com" };
const secondUserData = { name: "Task User2", email: "test2@email.com" };

beforeEach(async () => {
  await db.sync({ force: true });

  await User.create(userData);
});

afterAll(async () => {
  await db.close();
});

describe("Task API", () => {
  const taskData = {
    title: "Test Task",
    description: "This is a test task",
    status: Status.Todo,
    priority: Priority.Low,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
  };

  const getUser = async (): Promise<User> => {
    const user = await User.findOne({ where: { email: userData.email } });
    return user!;
  };

  const getSecondUser = async (): Promise<User> => {
    let user = await User.findOne({ where: { email: secondUserData.email } });

    if (!user) {
      user = await User.create(secondUserData);
    }

    return user;
  };

  it("POST /tasks creates a new task", async () => {
    const user = await getUser();

    const response = await request(app)
      .post("/tasks")
      .send({ ...taskData, userId: user.id })
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(taskData.title);
    expect(response.body.description).toBe(taskData.description);
    expect(response.body.status).toBe(taskData.status);
    expect(response.body.priority).toBe(taskData.priority);
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");

    const taskInDb = await Task.findByPk(response.body.id);
    expect(taskInDb).not.toBeNull();
  });

  it("POST /tasks with invalid data returns 400", async () => {
    const user = await getUser();

    await request(app)
      .post("/tasks")
      .send({ ...taskData, title: "", userId: user.id })
      .expect(400);

    await request(app)
      .post("/tasks")
      .send({ ...taskData, deadline: "invalid-date", userId: user.id })
      .expect(400);

    // TODO: temporary disconnect user and tasks
    // await request(app)
    //   .post("/tasks")
    //   .send({ ...taskData }) // missing userId
    //   .expect(400);
  });

  it("GET /tasks returns list of tasks", async () => {
    const user = await getUser();
    const secondUser = await getSecondUser();

    // Create two tasks
    await Task.create({ ...taskData, userId: user.id });
    await Task.create({
      ...taskData,
      title: "Second Task",
      userId: secondUser.id,
    });

    const response = await request(app).get("/tasks").expect(200);

    expect(response.body.length).toBe(2);
  });

  it("GET /tasks/:id returns a task by ID", async () => {
    const user = await getUser();

    const task = await Task.create({ ...taskData, userId: user.id });

    const response = await request(app).get(`/tasks/${task.id}`).expect(200);

    expect(response.body.id).toBe(task.id);
    expect(response.body.title).toBe(taskData.title);
  });

  it("GET /tasks/:id with non-existing ID returns 404", async () => {
    await request(app).get("/tasks/9999").expect(404);
  });

  it("PUT /tasks/:id updates a task", async () => {
    const user = await getUser();

    const task = await Task.create({ ...taskData, userId: user.id });

    const updatedData = {
      title: "Updated Task Title",
      description: "Updated description",
      status: Status.InProgress,
      priority: Priority.High,
    };

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send(updatedData)
      .expect(201);

    expect(response.body.id).toBe(task.id);
    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.description).toBe(updatedData.description);
    expect(response.body.status).toBe(updatedData.status);
    expect(response.body.priority).toBe(updatedData.priority);

    const updatedTaskInDb = await Task.findByPk(task.id);
    expect(updatedTaskInDb?.title).toBe(updatedData.title);
  });

  it("DELETE /tasks/:id deletes a task", async () => {
    const user = await getUser();

    const task = await Task.create({ ...taskData, userId: user.id });

    await request(app).delete(`/tasks/${task.id}`).expect(200);

    const taskInDb = await Task.findByPk(task.id);
    expect(taskInDb).toBeNull();
  });

  it("DELETE /tasks/:id with non-existing ID returns 404", async () => {
    await request(app).delete("/tasks/9999").expect(404);
  });
});
