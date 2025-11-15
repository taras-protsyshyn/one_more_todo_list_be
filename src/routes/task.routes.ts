import { Router } from "express";

import * as controller from "../controllers/task.controller";

const router = Router();

router.get("/", controller.getTasks);
router.get("/user/:userId", controller.getTasksByUserId);
router.get("/:id", controller.getTaskById);
router.post("/", controller.createTask);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

export default router;
