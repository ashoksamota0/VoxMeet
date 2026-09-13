import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createPremiumOrder,
  verifyPremiumPayment,
} from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", protect, createPremiumOrder);

paymentRouter.post("/verify", protect, verifyPremiumPayment);

export default paymentRouter;
