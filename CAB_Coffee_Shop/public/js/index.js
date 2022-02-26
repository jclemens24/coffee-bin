import { processProductFormData } from './productForm.js';
import { checkValidity } from './productForm.js';
import { processShopperFormData } from './shopperForm.js';

const productForm = document.querySelector('.product_form');
const shopperForm = document.querySelector('.shopper_form');

const input = document.querySelector('input');
input?.addEventListener('input', checkValidity.bind(input));

productForm?.addEventListener('submit', processProductFormData);
shopperForm?.addEventListener('submit', processShopperFormData);
