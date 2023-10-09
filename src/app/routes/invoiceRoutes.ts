import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import InvoiceController from "../controllers/InvoiceController";

const router = Router();

router.post("/", AuthMiddleware.authenticate, InvoiceController.create);
router.get("/", AuthMiddleware.authenticate, InvoiceController.findAll);
router.get(
  "/:invoice_id",
  AuthMiddleware.authenticate,
  InvoiceController.findById
);
router.put(
  "/:invoice_id",
  AuthMiddleware.authenticate,
  InvoiceController.updateById
);
router.delete(
  "/:invoice_id",
  AuthMiddleware.authenticate,
  InvoiceController.deleteById
);

export default router;
