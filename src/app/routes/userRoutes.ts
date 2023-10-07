import { Router } from "express";
import UserController from "../controllers/UserController";
import AuthMiddleware from "../middlewares/AuthMiddleware";

const router = Router();

router.post("/", UserController.create);
router.get("/", AuthMiddleware.authenticate, UserController.findAll);
router.get("/:id", AuthMiddleware.authenticate, UserController.findById);
router.put("/:id", AuthMiddleware.authenticate, UserController.updateById);
router.delete("/:id", AuthMiddleware.authenticate, UserController.deleteById);

export default router;
