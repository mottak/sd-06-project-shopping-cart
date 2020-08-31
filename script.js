const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function storage() {
  const olList = document.querySelector('.cart__items').innerHTML;
  localStorage.Lista = olList;
}

function cartItemClickListener(event) {
  const ol = document.querySelector('ol');
  ol.removeChild(event.target);
  storage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCart(sku) {
  const url2 = `https://api.mercadolibre.com/items/${sku}`;
  fetch(url2)
    .then(response => response.json())
    .then(({ id, title, price }) => {
      const li = createCartItemElement({ sku: id, name: title, salePrice: price });
      document.querySelector('.cart__items').appendChild(li);
      storage();
    })
    .catch(error => alert(`${error}`));
}

function listProduct() {
  fetch(url)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach(({ id, title, thumbnail }) => {
        const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
        item.addEventListener('click', (event) => {
          if (event.target.className === 'item__add') {
            const ids = (getSkuFromProductItem(event.target.parentElement));
            addCart(ids);
          }
        });
        document.querySelector('.items').appendChild(item);
      });
    })
    .catch('Erro');
}

function loadStorage() {
  if (localStorage.Lista) {
    document.querySelector('.cart__items').innerHTML = localStorage.Lista;
    document.querySelectorAll('.cart__item').forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
}

window.onload = function onload() {
  loadStorage();
  listProduct();
};
