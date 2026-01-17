import Stripe from "stripe";
import { envVars } from "../config/env";

export const stripe = new Stripe(envVars.STRIPE_SECRET_KEY);
