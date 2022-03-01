import { data } from '../../data/product-details.js';

console.log(data);

const product = document.querySelectorAll('.dropdown-item');
const modalBody = document.querySelector('.modal-body');
class CartView {
  _parentElement = document.querySelector('.modal-body');
  _listElement = document.querySelector('.modal-items');
  _cartTotals = document.querySelector('.cart-totals');
  _message = '';
  items = [];
  totalItems = 0;
  totalAmount = 0;

  render() {
    if (this.items.length === 0) {
      return this.emptyCart();
    }
    const markup = this.items.map(this.generateMarkup).join('');
    this._listElement.insertAdjacentHTML('afterbegin', markup);
    this._cartTotals.innerHTML = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.calcTotalCartPrice());
  }

  generateMarkup(data) {
    return `<li class="modal-item" id="${data.id}">
              <img class="coffee_modal_img" src="/public/img/${
                data.img
              }" alt='${data.description}' />
              <p>${data.category}</p>
              <p>${data.description}</p>
              <p>${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(data.price)}</p>
              <div class="cart-actions">
                <i class="bi bi-plus-circle inline-button" data-add="1" data-price=${
                  data.price
                } data-id=${data.id}></i>
                <span class="item-quantity">${data.quantity}</span>
                <i class="bi bi-dash-circle inline-button" data-minus="1" data-price=${
                  data.price
                } data-id=${data.id}></i>
              </div>
            </li>`;
  }

  update(data) {
    this.calcNumberOfCartItems();
    if (this.totalAmount === 0) {
      this.emptyCart();
    } else {
      const oldDOM = document.getElementById(`${data.id}`);
      oldDOM.querySelector('span').textContent = `${data.quantity}`;
      this._cartTotals.innerHTML = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(this.calcTotalCartPrice());
    }
  }

  clear() {
    this._listElement.innerHTML = '';
    this._cartTotals.innerHTML = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.calcTotalCartPrice());
  }

  calcNumberOfCartItems() {
    this.totalItems = this.items.reduce(
      (prev, curr) => prev + curr.quantity,
      0
    );
    return this.totalItems;
  }

  calcTotalCartPrice() {
    this.totalAmount = this.items.reduce((acc, item) => {
      const price = item.price;
      const quantity = item.quantity;
      return acc + price * quantity;
    }, 0);

    return this.totalAmount;
  }

  emptyCart() {
    this.clear();
    this._listElement.textContent = `You're cart is empty`;
  }

  saveCart() {
    const cart = localStorage.setItem('cart', JSON.stringify(this.items));
    console.log(cart);
  }
}

const onWindowReload = function () {
  const storage = localStorage.getItem('cart');
  if (storage) cart.items = JSON.parse(storage);
  cart.render(storage);
  window.removeEventListener('load', onWindowReload);
};

window.addEventListener('load', onWindowReload);

const addItemToCart = function (id) {
  const item = cart.items.find(prod => prod.id === +id);
  item.quantity++;
  cart.update(item);
};

const removeItemFromCart = function (id) {
  const item = cart.items.find(prod => prod.id === +id);
  if (item.quantity === 1) {
    cart.items = cart.items.filter(prod => prod.id !== +id);
    cart.clear();
    cart.render();
  }
  if (item.quantity > 1) {
    item.quantity--;
    cart.update(item);
  }
};

modalBody.addEventListener('click', function (e) {
  const button = e.target.closest('.inline-button');
  if (!button) return;
  button.dataset.add
    ? addItemToCart(button.dataset.id)
    : removeItemFromCart(button.dataset.id);
});

const initializeCart = function (e) {
  const id = e.target.dataset.id;
  const itemAlreadyInCart = cart.items.find(item => item.id === +id);
  if (itemAlreadyInCart) {
    itemAlreadyInCart.quantity++;
    cart.update(itemAlreadyInCart);
  } else {
    const getItem = data.find(item => item.id === +id);
    getItem.quantity = 1;
    cart.items.push(getItem);
    cart.clear();
    cart.render();
  }
};

const cart = new CartView();

product.forEach(el => {
  el.addEventListener('click', initializeCart);
});
