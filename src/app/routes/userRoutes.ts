import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.post("/", UserController.create);
router.get("/", UserController.findAll);
router.get("/:id", UserController.findById);
router.put("/:id", UserController.updatedById);
router.delete("/:id", UserController.deleteById);

export default router;
