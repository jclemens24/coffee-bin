const modalBody = document.querySelector('.modal-body');
const cartIcon = document.querySelector('.bi-cart-fill');
const spinner = document.getElementById('spinner');
const lazyLoadImg = document.querySelectorAll('img[data-src]');
const btnReset = document.querySelector('.reset_button');
const btnSave = document.querySelector('.save_button');

var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  // eslint-disable-next-line no-undef
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

if (btnReset) {
  btnReset.addEventListener('click', function (e) {
    cart.emptyCart();
  });
}

if (btnSave) {
  btnSave.addEventListener('click', function (e) {
    cart.saveCart();
  });
}

if (lazyLoadImg.length !== 0) {
  const revealImgs = function (entries, observer) {
    const [entry] = entries;
    console.log(entry);

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function (e) {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  };
  const imgObserver = new IntersectionObserver(revealImgs, {
    root: null,
    threshold: [0, 0.25, 0.5, 0.75, 1],
    rootMargin: '0px'
  });
  lazyLoadImg.forEach(img => {
    imgObserver.observe(img);
  });
}

if (cartIcon) {
  cartIcon.addEventListener('click', function (e) {
    if (cart.items.length === 0) {
      cart.emptyCart();
    }
    spinner.classList.toggle('visible');
  });
}

const fetchAllProducts = async function () {
  try {
    spinner.classList.toggle('invisible');
    const res = await fetch('http://localhost:8000/api/products');
    if (!res.ok || res.status === 404) {
      throw new Error('Something went wrong. Please try again.');
    }
    const data = await res.json();
    const { products } = data;
    spinner.classList.toggle('invisible');
    return products;
  } catch (err) {
    console.log(err);
  }
};

class spanMessages extends HTMLSpanElement {
  constructor() {
    super();

    this.textContent = 'Saved Successfully!';
    this.style.display = 'block';
    this.style.padding = '0.5rem 0';
    this.style.color = 'var(--bs-green)';
  }
}

customElements.define('span-message', spanMessages, { extends: 'span' });

class CartView {
  _parentElement = document.querySelector('.modal-body');
  _listElement = document.querySelector('.modal-items');
  _cartTotals = document.querySelector('.cart-totals');
  _cartBadge = document.querySelectorAll('.cartBadge');
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
    this._cartBadge.forEach(badge => {
      badge.textContent = this.calcNumberOfCartItems();
    });
  }

  generateMarkup(data) {
    return `<li class="modal-item" id="${data._id}">
              <img class="coffee_modal_img" src="../public/img/${
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
      this._cartBadge.forEach(badge => {
        badge.textContent = this.calcNumberOfCartItems();
      });
    }
  }

  clear() {
    this._listElement.innerHTML = '';
    this._cartTotals.innerHTML = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.calcTotalCartPrice());
    return this;
  }

  calcNumberOfCartItems() {
    this.totalItems = this.items?.reduce(
      (prev, curr) => prev + curr.quantity,
      0
    );
    return this.totalItems;
  }

  calcTotalCartPrice() {
    this.totalAmount = this.items?.reduce((acc, item) => {
      const { price } = item;
      const { quantity } = item;
      return acc + price * quantity;
    }, 0);

    return this.totalAmount;
  }

  emptyCart() {
    this.clear();
    this.items.splice(0);
    this.calcTotalCartPrice();
    this.calcNumberOfCartItems();
    this._listElement.textContent = `You're cart is empty`;
    this._cartBadge.forEach(badge => {
      badge.textContent = this.totalAmount;
    });
    this._cartTotals.innerHTML = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.calcTotalCartPrice());
    localStorage.removeItem('cart');
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    const span = document.createElement('span', {
      is: 'span-message'
    });
    this._parentElement.appendChild(span);

    setTimeout(() => {
      this._parentElement.removeChild(span);
    }, 5000);
  }
}

const onWindowReload = function () {
  const storage = localStorage.getItem('cart');
  if (storage) cart.items = JSON.parse(storage);
  cart.render();
  spinner.classList.remove('visible');
  spinner.classList.add('invisible');
};

if (window.location.pathname === '/views/coffee-products.html') {
  window.addEventListener('load', onWindowReload);
}

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

modalBody?.addEventListener('click', function (e) {
  const button = e.target.closest('.inline-button');
  if (!button) return;
  button.dataset.add
    ? addItemToCart(button.dataset.id)
    : removeItemFromCart(button.dataset.id);
});

export const initializeCart = async function (e) {
  const { id } = e.target.dataset;
  const itemAlreadyInCart = cart.items.find(item => item._id === id);
  if (itemAlreadyInCart) {
    itemAlreadyInCart.quantity++;
    cart.update(itemAlreadyInCart);
  } else {
    const products = await fetchAllProducts();
    const getItem = products.find(item => item._id === id);
    getItem.quantity++;
    cart.items.push(getItem);
    cart.clear();
    cart.render();
  }
};

const cart = new CartView();
