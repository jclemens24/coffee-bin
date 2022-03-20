import Stripe from 'stripe';
import Product from '../model/productModel.mjs';
import Customer from '../model/customerModel.mjs';
import Checkout from '../model/checkoutModel.mjs';
import AppError from '../utils/appError.mjs';
import { catchAsync } from '../utils/catchAsync.mjs';

let globalItems;

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  globalItems = Object.keys(req.body);
  const stripe = new Stripe(process.env.STRIPE_API_KEY);
  const quantities = Object.values(req.body);
  const product = await Product.find({ _id: globalItems });
  console.log(product);

  if (!product) return next(new AppError('Could not find that product', 404));

  const line_items = product.map((item, i) => {
    return {
      description: item.description,
      price_data: {
        unit_amount: item.price * 100,
        product: item._id,
        currency: 'usd',
        product_data: {
          name: item.category,
          description: item.description,
          metadata: {
            id: item._id
          }
        }
      },
      quantity: quantities[i]
    };
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    shipping_address_collection: {
      allowed_countries: ['US', 'CA']
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd'
          },
          display_name: 'Free shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5
            },
            maximum: {
              unit: 'business_day',
              value: 7
            }
          }
        }
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 700,
            currency: 'usd'
          },
          display_name: 'Regular shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 2
            },
            maximum: {
              unit: 'business_day',
              value: 4
            }
          }
        }
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1500,
            currency: 'usd'
          },
          display_name: 'Next day air',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1
            },
            maximum: {
              unit: 'business_day',
              value: 1
            }
          }
        }
      }
    ],
    success_url: `${req.protocol}://${req.ip}:5500/dist`,
    cancel_url: `${req.protocol}://${req.ip}:5500/dist`,
    line_items: line_items
  });
  res.status(200).json({
    session
  });
});

const createBookingCheckout = async (session, lineItems) => {
  const items = await Product.find({ _id: globalItems });
  const customer = (
    await Customer.findOne({ email: session.customer_details.email })
  )._id;
  const totalPrice = session.amount_total / 100;
  await Checkout.create({ customer, totalPrice, items });
};

export const webhookCheckout = catchAsync(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_API_KEY);
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
});
