import 'core-js';
import 'regenerator-runtime';
import { checkProductValidity, processProductFormData } from './productForm.js';
import { checkShopperValidity, processShopperFormData } from './shopperForm.js';
import { initializeCart } from './coffeeProducts.js';

const productForm = document.querySelector('.product_form');
const shopperForm = document.querySelector('.shopper_form');
const input = document.querySelectorAll('input');
const product = document.querySelectorAll('.dropdown-item');

if (productForm) {
  input.forEach(el => {
    el.addEventListener('input', checkProductValidity.bind(el));
  });
  productForm.addEventListener('submit', processProductFormData);
}

if (shopperForm) {
  input.forEach(el => {
    el.addEventListener('input', checkShopperValidity.bind(el));
  });
  shopperForm.addEventListener('submit', processShopperFormData);
}

if (product) {
  product.forEach(el => {
    el.addEventListener('click', initializeCart);
  });
}
