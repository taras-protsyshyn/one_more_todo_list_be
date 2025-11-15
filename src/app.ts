import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import cors from "cors";

import taskRouter from "./routes/task.routes";
import userRouter from "./routes/user.routes";
import type { AppError } from "./errors";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/tasks", taskRouter);
app.use("/users", userRouter);

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(error.statusCode).send({ message: error.message });
});

export default app;
