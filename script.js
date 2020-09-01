function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const arrFilter = arr => arr.filter(pos => pos !== '');

function updateLocalStorage(addOrRemove, id) {
  const data = localStorage.getItem('cartShop');
  if (addOrRemove === 'add') {
    const arrData = (data !== null) ? [data, id] : [id];
    localStorage.setItem('cartShop', arrFilter(arrData));
  }
  if (addOrRemove === 'remove') {
    const arrData = data.split(',');
    arrData.splice(arrData.findIndex(a => a === id), 1);
    localStorage.setItem('cartShop', arrFilter(arrData));
  }
}

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  const id = event.target.innerHTML.split(' ')[1];
  ol.removeChild(event.target);
  updateLocalStorage('remove', id);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCartShop(data) {
  const li = createCartItemElement({ sku: data.id, name: data.title, salePrice: data.price });
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
  updateLocalStorage('add', data.id);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchItem(itemId) {
  const urlAPIItem = `https://api.mercadolibre.com/items/${itemId}`;
  fetch(urlAPIItem)
  .then(response => response.json())
  .then(data => addCartShop(data))
  .catch(error => window.alert(error));
}

function eventClickBt(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  fetchItem(itemId);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') e.addEventListener('click', eventClickBt);
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

function listElements(arrResults) {
  arrResults.forEach((product) => {
    const sku = product.id;
    const name = product.title;
    const image = product.thumbnail;
    const secItems = document.querySelector('.items');
    secItems.appendChild(createProductItemElement({ sku, name, image }));
  });
}

const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function fetchMLB(url) {
  fetch(url)
  .then(response => response.json())
  .then(data => listElements(data.results))
  .catch(error => window.alert(error));
}

function getLocalStorageInfo() {
  if (localStorage.getItem('cartShop') !== null) {
    const historyProduct = localStorage.getItem('cartShop').split(',');
    const filteredArray = arrFilter(historyProduct);
    if (filteredArray.length > 0) {
      filteredArray.forEach((product) => {
        fetchItem(product);
        updateLocalStorage('remove', product);
      });
    }
  }
}

function btCleaner() {
  const btClean = document.querySelector('.empty-cart');
  btClean.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.setItem('cartShop', '');
  });
}

window.onload = () => {
  fetchMLB(urlAPI);
  getLocalStorageInfo();
  btCleaner();
};
