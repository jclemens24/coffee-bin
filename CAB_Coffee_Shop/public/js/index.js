import { processProductFormData } from './productForm.js';
import { checkValidity } from './productForm.js';
import { processShopperFormData } from './shopperForm.js';

const productForm = document.querySelector('.product_form');
const shopperForm = document.querySelector('.shopper_form');
const product = document.querySelectorAll('.dropdown-item');
const modalBody = document.querySelector('.modal-body');

let cart = {
  totalItems: 0,
  items: [],
  totalAmount: 0
};

const availableProducts = [
  {
    id: 537890,
    img: 'columbian.c59b7255.jpeg',
    description: 'Columbian',
    category: 'Coffee',
    unit: 'grams',
    price: '$10.59',
    weight: 15
  },
  {
    id: 642318,
    description: 'Green',
    category: 'Tea',
    unit: 'grams',
    price: '$7.99',
    weight: 15
  },
  {
    id: 674129,
    description: 'Mug',
    category: 'Merch',
    unit: 'oz',
    price: '$9.99',
    weight: 15
  }
];

modalBody.addEventListener('click', function (e) {
  const button = e.target.closest('.inline-button');
  if (!button) return;
  console.log(button);
  if (button.dataset.add) {
    cart.totalItems++;
    console.log(cart);
  } else {
    cart.totalItems--;
    console.log(cart);
  }
});
const input = document.querySelector('input');
input?.addEventListener('input', checkValidity.bind(input));

function addToCart(item) {
  const text = `<div class="modal-item">
                  <img class="coffee_modal_img" src="/${item.img}" alt='${item.description}' />
                  <p>${item.category}</p>
                  <p>${item.description}</p>
                  <p>${item.price}</p>
                  <i class="bi bi-plus-circle inline-button" data-add="1"></i>
                  <i class="bi bi-dash-circle inline-button" data-minus="1"></i>
              </div>
  `;
  return modalBody.insertAdjacentHTML('beforeend', text);
}

product.forEach(el => {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = e.target.dataset.id;
    const foundItem = availableProducts.find(prod => prod.id === +id);
    cart.items.push(foundItem);
    cart.totalItems++;
    cart.totalAmount = foundItem.price;
    console.log(cart);
    addToCart(foundItem);
  });
});

productForm?.addEventListener('submit', processProductFormData);
shopperForm?.addEventListener('submit', processShopperFormData);
