import Stripe from 'stripe';
import Products from '../model/productModel.mjs';
import AppError from '../utils/appError.mjs';
import { catchAsync } from '../utils/catchAsync.mjs';

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_API_KEY);
  const ids = Object.keys(req.body);
  const quantities = Object.values(req.body);
  const product = await Products.find({ _id: ids });

  if (!product) return next(new AppError('Could not find that product', 404));

  const line_items = product.map((item, i) => {
    return {
      description: item.description,
      price_data: {
        unit_amount: item.price * 100,
        currency: 'usd',
        product_data: {
          name: item.category,
          description: item.description,
          images: [`${req.protocol}://127.0.0.1:8000/img/${item.image}`]
        }
      },
      quantity: quantities[i]
    };
  });
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.ip}:5500/dist`,
    cancel_url: `${req.protocol}://${req.ip}:5500/dist`,
    customer_email: 'jclemens24@hotmail.com',
    client_reference_id: product._id,
    line_items: line_items
  });
  res.status(200).json({
    session
  });
});
