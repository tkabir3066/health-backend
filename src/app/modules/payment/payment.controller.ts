import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import type { IJwtPayload } from "../../types/common";
import { sendResponse } from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { PaymentService } from "./payment.service";
import { stripe } from "../../helper/stripe";
import { envVars } from "../../config/env";

const handleStripeWebhookEvent = catchAsync(
  async (
    req: Request & { user?: IJwtPayload },
    res: Response,
    next: NextFunction,
  ) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = envVars.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    const result = await PaymentService.handleStripeWebhookEvent(event);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Appointment created successfully",
      data: result,
    });
  },
);

export const PaymentController = {
  handleStripeWebhookEvent,
};
