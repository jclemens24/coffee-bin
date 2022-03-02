import express from 'express';
import { getAllProducts } from '../controller/productController.mjs';

const router = express.Router();

router.route('/').get(getAllProducts);

export { router };
