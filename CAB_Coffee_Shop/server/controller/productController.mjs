import Product from '../model/productModel.mjs';
import { catchAsync } from '../utils/catchAsync.mjs';

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({});

  if (!products) return next();

  res.status(200).json({
    status: 'success',
    products
  });
});
