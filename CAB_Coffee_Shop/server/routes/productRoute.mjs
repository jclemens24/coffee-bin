import express from 'express';
import * as productController from '../controller/productController.mjs';

const router = express.Router();

router.route('/').get(productController.getAllProducts);
router.post('/new', productController.createAProduct);

export { router };
