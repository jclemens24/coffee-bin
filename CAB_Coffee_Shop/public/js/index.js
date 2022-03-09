import 'core-js';
import 'regenerator-runtime';
import '../css/styles.css';
import slider from './slider.js';
import { handleHover } from './stickyNav.js';

const productForm = document.querySelector('.product_form');
const shopperForm = document.querySelector('.shopper_form');
const input = document.querySelectorAll('input');
const product = document.querySelectorAll('.dropdown-item');
const navigation = document.querySelector('.heading_nav');
const { body } = document;
const checkoutForm = document.querySelector('.send_cart');

if (navigation) {
  navigation.addEventListener('mouseover', handleHover.bind(0.2));
  navigation.addEventListener('mouseout', handleHover.bind(1));
}

if (body.id === 'Index') {
  slider();
}

if (productForm) {
  import('./productForm.js').then(Module => {
    input.forEach(el => {
      el.addEventListener('input', Module.checkProductValidity.bind(el));
    });
    productForm.addEventListener('submit', Module.processProductFormData);
  });
}

if (shopperForm) {
  import('./shopperForm.js').then(Module => {
    input.forEach(el => {
      el.addEventListener('input', Module.checkShopperValidity.bind(el));
    });
    shopperForm.addEventListener('submit', Module.processShopperFormData);
  });
}

if (product.length !== 0) {
  import('./coffeeProducts.js').then(Module => {
    product.forEach(el => {
      el.addEventListener('click', Module.initializeCart);
    });
  });
}

const checkoutProcess = async function (items) {
  try {
    // eslint-disable-next-line no-undef
    const stripe = Stripe(
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

if (checkoutForm) {
  checkoutForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    import('./coffeeProducts.js').then(Module => {
      const cartItems = Module.cart.checkout();
      checkoutProcess(cartItems);
    });
  });
}
