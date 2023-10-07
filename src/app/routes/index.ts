import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import invoiceRoutes from "./invoiceRoutes";

const router = Router();

router.get("/", (req, res) => {
  return res.json({ message: "hello world" });
});

router.use("/invoice", invoiceRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);

export default router;
