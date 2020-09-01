function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  localStorage.removeItem(event.target.innerText.substr(5, 13));
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li);
  return li;
}

const createInLocalStorage = (sku, name) => {
  localStorage.setItem(sku, name);
};

const fetchItem = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then((item) => {
      const sku = item.id;
      const name = item.title;
      const salePrice = item.price;
      const itemObject = { sku, name, salePrice };
      createCartItemElement(itemObject);
      createInLocalStorage(sku, name);
    });
};

const getItem = () => {
  const target = event.target;
  const parentTarget = target.parentElement;
  const id = parentTarget.firstChild.innerText;
  fetchItem(id);
};

const fetchUrl = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then(response => response.json())
    .then((object) => {
      object.results.forEach((element) => {
        const sku = element.id;
        const name = element.title;
        const image = element.thumbnail;
        document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }));
        const items = document.querySelector('.items').lastChild;
        items.lastChild.addEventListener('click', getItem);
      });
    });
};

const checkLocalStorage = () => {
  const keys = Object.keys(localStorage);
  if (keys.length > 0) {
    keys.forEach(id => fetchItem(id));
  }
};

const clearCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    while (cartItems.firstChild) {
      cartItems.removeChild(cartItems.firstChild);
    }
    localStorage.clear();
  });
};

window.onload = function onload() {
  fetchUrl();
  clearCart();
  checkLocalStorage();
};
