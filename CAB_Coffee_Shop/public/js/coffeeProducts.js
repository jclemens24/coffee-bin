const product = document.querySelectorAll('.dropdown-item');
const modalBody = document.querySelector('.modal-body');

const fetchAllProducts = async function () {
  try {
    const res = await fetch('http://localhost:8000/api/products');
    if (!res.ok || res.status === 404) {
      throw new Error(res.message);
    }
    const data = await res.json();
    const { products } = data;
    return products;
  } catch (err) {
    console.log(err ?? 'Something went wrong. Please try your request again!');
  }
};

const products = await fetchAllProducts();
class CartView {
  _parentElement = document.querySelector('.modal-body');
  _listElement = document.querySelector('.modal-items');
  _cartTotals = document.querySelector('.cart-totals');
  _cartBadge = document.getElementById('cartBadge');
  _cartNavBadge = document.getElementById('cartNav');
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
    this._cartBadge.textContent = this.calcNumberOfCartItems();
    this._cartNavBadge.textContent = this.calcNumberOfCartItems();
  }

  generateMarkup(data) {
    return `<li class="modal-item" id="${data._id}">
              <img class="coffee_modal_img" src="/public/img/${
                data.image
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
                } data-id=${data._id}></i>
                <span class="item-quantity">${data.quantity}</span>
                <i class="bi bi-dash-circle inline-button" data-minus="1" data-price=${
                  data.price
                } data-id=${data._id}></i>
              </div>
            </li>`;
  }

  update(data) {
    this.calcNumberOfCartItems();
    if (this.totalAmount === 0) {
      this.emptyCart();
    } else {
      const oldDOM = document.getElementById(`${data._id}`);
      oldDOM.querySelector('span').textContent = `${data.quantity}`;
      this._cartTotals.innerHTML = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(this.calcTotalCartPrice());
      this._cartBadge.textContent = this.calcNumberOfCartItems();
      this._cartNavBadge.textContent = this.calcNumberOfCartItems();
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
      const { price } = item;
      const { quantity } = item;
      return acc + price * quantity;
    }, 0);

    return this.totalAmount;
  }

  emptyCart() {
    this.clear();
    this._listElement.textContent = `You're cart is empty`;
    this._cartBadge.textContent = this.calcNumberOfCartItems();
    this._cartNavBadge.textContent = this.calcNumberOfCartItems();
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
  const item = cart.items.find(prod => prod._id === id);
  item.quantity++;
  cart.update(item);
};

const removeItemFromCart = function (id) {
  const item = cart.items.find(prod => prod._id === id);
  if (item.quantity === 1) {
    item.quantity--;
    cart.items = cart.items.filter(prod => prod._id !== id);
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

const initializeCart = async function (e) {
  const { id } = e.target.dataset;
  const itemAlreadyInCart = cart.items.find(item => item._id === id);
  if (itemAlreadyInCart) {
    itemAlreadyInCart.quantity++;
    cart.update(itemAlreadyInCart);
  } else {
    const getItem = products.find(item => item._id === id);
    getItem.quantity++;
    cart.items.push(getItem);
    cart.clear();
    cart.render();
  }
};

const cart = new CartView();

product.forEach(el => {
  el.addEventListener('click', initializeCart);
});
