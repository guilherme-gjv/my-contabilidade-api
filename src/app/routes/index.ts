import { Router } from "express";
import userRoutes from "./userRoutes";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

router.use("/user", userRoutes);

export default router;
