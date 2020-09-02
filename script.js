function saveOrDelete() {
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('Item', ol.innerHTML);
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
  // coloque seu código aqui
  const item = event.target;
  const ol = document.querySelector('.cart__items');
  ol.removeChild(item);
  saveOrDelete();
}
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  saveOrDelete();
  return li;
}
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  const gallery = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    const halfUrl = 'https://api.mercadolibre.com/items/';
    const item = id;
    const url = `${halfUrl}${item}`;
    fetch(url)
    .then(response => response.json())
    .then(json => createCartItemElement(json));
  });
  gallery.appendChild(section);
  return section;
}
  /* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
  } */
/* function cartItemClickListener(event) {
  // coloque seu código aqui
  const item = event.target;
  const ol = document.querySelector('.cart__items');
  ol.removeChild(item);
  saveOrDelete();
}
 function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  saveOrDelete();
  return li;
} */
function urlItemOnload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
    .then((json) => {
      json.results.forEach(ele => createProductItemElement(ele));
    });
}
window.onload = function onload() {
  urlItemOnload();
  if (localStorage.Item) {
    document.querySelector('.cart__items').innerHTML = localStorage.Item;
  }
};
