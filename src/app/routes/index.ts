import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import invoiceRoutes from "./invoiceRoutes";
import invoiceItemRoutes from "./invoiceItemRoutes";

const router = Router();

router.get("/", (req, res) => {
  return res.json({ message: "hello world" });
});

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/invoice", invoiceRoutes);
router.use("/invoice/:invoice_id/item", invoiceItemRoutes);

export default router;
