import express from 'express';
import { getCheckoutSession } from '../controller/checkoutController.mjs';

const router = express.Router();

router.post('/checkout-session', getCheckoutSession);

export { router };
