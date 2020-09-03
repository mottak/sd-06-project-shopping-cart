window.onload = function onload() {
  getItems();
  let keys = Object.keys(localStorage)
  let cart__items = document.querySelector('.cart__items');
  let inner = '';
  let li;
  for (let i = 0; i < keys.length; i++) {
    inner = localStorage.getItem(keys[i]);
    li = document.createElement('li');
    li.innerText = inner;
    li.id = `${sku}`;
    li.addEventListener('click', (event) => cartItemClickListener(event));
    cart__items.appendChild(li);
  }
};

function getItems() {
  const items = document.querySelector(".items");
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
    .then(r => r.json())
    .then(r => r.results.map(item => createProductItemElement(item)))
    .then(itemList => itemList.forEach((item) => {
      items.appendChild(item);
    }))

    .then(() => {
      let item__add = document.querySelectorAll('.item__add');
      item__add.forEach(element => {
        element.addEventListener("click", (e) => addToCart(e))
      })
    })
}

function addToCart(event) {
  let parent = event.target.parentNode;
  let cart__items = document.querySelector('.cart__items');
  let itemID = getSkuFromProductItem(parent);
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then(r => r.json())
    .then(product => createCartItemElement(product))
    .then((li) => cart__items.appendChild(li))
    .then((li) => localStorage.setItem(itemID, li.innerHTML))
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
  // localStorage.removeItem(event.target.id);
  console.log(event.target.id)
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${sku}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li;
}

