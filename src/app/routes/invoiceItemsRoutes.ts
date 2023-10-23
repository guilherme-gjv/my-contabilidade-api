import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import InvoiceItemController from "../controllers/InvoiceItemController";

const router = Router({ mergeParams: true });

router.post("/", AuthMiddleware.authenticate, InvoiceItemController.createMany);

export default router;
