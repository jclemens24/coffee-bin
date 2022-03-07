import 'core-js';
import 'regenerator-runtime';
import { checkProductValidity, processProductFormData } from './productForm.js';
import { checkShopperValidity, processShopperFormData } from './shopperForm.js';
import { initializeCart, cart } from './coffeeProducts.js';

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

if (product.length !== 0) {
  product.forEach(el => {
    el.addEventListener('click', initializeCart);
  });
}

const checkoutProcess = async function (items) {
  try {
    // eslint-disable-next-line no-undef
    const stripe = stripe(
      'pk_test_51KaMtSCeG8rgbalbuXncDRdtRegT24VO64UAEbemtj0uyw2dqWWXbXPlusY5AGbVIjT5IEIb2iay04ik9thwhCfc00xWDoDyh0'
    );
    const req = await fetch(
      'http://localhost:8000/api/checkout/checkout-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer pk_test_51KaMtSCeG8rgbalbuXncDRdtRegT24VO64UAEbemtj0uyw2dqWWXbXPlusY5AGbVIjT5IEIb2iay04ik9thwhCfc00xWDoDyh0'
        },
        body: JSON.stringify(items)
      }
    );
    const res = await req.json();
    await stripe.redirectToCheckout({
      sessionId: res.session.id
    });
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  cart.checkout(checkoutProcess);
};

if (window.location.pathname === '/views/coffee-products.html') {
  init();
}
