import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import InvoiceItemController from "../controllers/InvoiceItemController";

const router = Router();

router.post("/", AuthMiddleware.authenticate, InvoiceItemController.create);
router.get("/", AuthMiddleware.authenticate, InvoiceItemController.findAll);
router.get(
  "/:invoice_item_id",
  AuthMiddleware.authenticate,
  InvoiceItemController.findById
);
router.put(
  "/:invoice_item_id",
  AuthMiddleware.authenticate,
  InvoiceItemController.updateById
);
router.delete(
  "/:invoice_item_id",
  AuthMiddleware.authenticate,
  InvoiceItemController.deleteById
);

export default router;
