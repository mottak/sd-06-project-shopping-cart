function loadingMessage() {
  const loadText = document.createElement('div');
  loadText.classList.add('loading');
  loadText.innerHTML = 'Loading...';
  document.querySelector('.items').appendChild(loadText);
}

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

function cartItemClickListener(event) {
  console.log(event.target.innerHTML);
  console.log(typeof event.target.innerHTML);
  event.target.remove();
  localStorage.setItem('cartItems', document.querySelector('.cart__items').innerHTML);
}

function clearCartList() {
  document.querySelector('.cart__items').innerHTML = '';
  localStorage.setItem('cartItems', document.querySelector('.cart__items').innerHTML);
  localStorage.setItem('sumPrice', 0);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);

  const cartSection = document.querySelector('.cart');
  cartSection.appendChild(li);

  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchItemList(event) {
  const item = event.target.parentElement;
  console.log(item);
  const id = getSkuFromProductItem(item);
  const url = `https://api.mercadolibre.com/items/${id}`;

  fetch(url)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      }
      document.querySelector('.cart__items').appendChild(createCartItemElement(object));
      return object.price;
    })
    .then(price => sumPrices(price))
    .then(() => localStorage.setItem('cartItems', document.querySelector('.cart__items').innerHTML))
    .catch(error => window.alert(error));
}

function sumPrices(value) {
  let currentValue = Number(localStorage.getItem('sumPrice'));
  currentValue = value + currentValue;
  localStorage.setItem('sumPrice', currentValue);
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  const itemsSection = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', event => fetchItemList(event));

  itemsSection.appendChild(section);
  return section;
}

function fetchProductList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

  fetch(url)
    .then(response => response.json())
    .then((object) => {
      document.querySelector('.items').innerHTML = '';
      object.results.forEach(item => createProductItemElement(item));
    });
}

window.onload = function onload() {
  loadingMessage();
  fetchProductList();

  document.querySelector('.empty-cart').addEventListener('click', clearCartList);
  // localStorage.setItem('sumPrice', 0);

  if (localStorage.getItem('cartItems')) {
    document.querySelector('.cart__items').innerHTML = localStorage.getItem('cartItems');
    document.querySelectorAll('.cart__item')
      .forEach(item => item.addEventListener('click', cartItemClickListener));
  }
};
