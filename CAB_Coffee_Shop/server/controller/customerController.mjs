import Customer from '../model/customerModel.mjs';
import AppError from '../utils/appError.mjs';
import { catchAsync } from '../utils/catchAsync.mjs';
import { getCoordsFromAddress } from '../utils/location.mjs';

export const getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await Customer.find({});

  if (!customers) return next();

  res.status(200).json({
    status: 'success',
    customers
  });
});

export const createACustomer = catchAsync(async (req, res, next) => {
  const coordinates = await getCoordsFromAddress(
    `${req.body.streetAddress} ${req.body.state} ${req.body.zip}`
  );
  const customer = await Customer.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body?.phone ?? null,
    birthday: req.body.birthday,
    location: {
      coordinates: [coordinates.lng, coordinates.lat],
      address: req.body.streetAddress,
      state: req.body.state,
      zip: req.body.zip
    }
  });

  if (!customer) {
    return next(new AppError('Unable to create a user', 404));
  }

  res.status(201).json({
    status: 'success',
    customer
  });
});
