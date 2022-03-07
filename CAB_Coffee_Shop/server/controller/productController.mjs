import Product from '../model/productModel.mjs';
import AppError from '../utils/appError.mjs';
import { catchAsync } from '../utils/catchAsync.mjs';

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({});

  if (!products) return next();

  res.status(200).json({
    status: 'success',
    products
  });
});

export const createAProduct = catchAsync(async (req, res, next) => {
  const { description, category, unit, price, weight } = req.body;
  if (!(description || category || unit || price || weight))
    return next(
      new AppError('You must submit all required fields to add a product', 400)
    );
  const product = await Product.create({
    description,
    category,
    unit,
    price,
    weight
  });

  res.status(201).json({
    status: 'success',
    product
  });
});
