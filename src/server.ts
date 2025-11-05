import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import cors from "cors";

import taskRouter from "./routes/task.routes.js";
import type { AppError } from "./errors.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/tasks", taskRouter);

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(error.statusCode).send({ message: error.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
