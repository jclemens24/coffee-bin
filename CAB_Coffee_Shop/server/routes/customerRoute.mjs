import express from 'express';
import { getAllCustomers } from '../controller/customerController.mjs';
import { createACustomer } from '../controller/customerController.mjs';

const router = express.Router();

router.route('/').get(getAllCustomers).post(createACustomer);

export { router };
