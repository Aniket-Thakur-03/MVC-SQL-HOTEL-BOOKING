import { Router } from "express";
import { showInvoicesAll } from "../Controllers/invoice.controller.js";
import { adminOnly } from "../Middleware/tokenverify.js";
const invoiceRouter = Router();

invoiceRouter.get("/get/all/:id", adminOnly, showInvoicesAll);

export { invoiceRouter };
