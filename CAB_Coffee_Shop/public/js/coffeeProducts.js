import data from '../../data/product-details.json';

console.log(data);

const product = document.querySelectorAll('.dropdown-item');
const modalBody = document.querySelector('.modal-body');

let cart = {
  totalItems: 0,
  items: [],
  totalAmount: 0
};

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
    const foundItem = data.find(prod => prod.id === +id);
    cart.items.push(foundItem);
    cart.totalItems++;
    cart.totalAmount = foundItem.price;
    console.log(cart);
    addToCart(foundItem);
  });
});
