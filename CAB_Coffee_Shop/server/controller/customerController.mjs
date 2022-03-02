import Customer from '../model/customerModel.mjs';
import { catchAsync } from '../utils/catchAsync.mjs';

export const getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await Customer.find({});

  if (!customers) return next();

  res.status(200).json({
    status: 'success',
    customers
  });
});
