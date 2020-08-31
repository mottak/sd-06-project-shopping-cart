// mercado livre API
const base = 'https://api.mercadolibre.com/';

// create product image
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// funcs to delete our items or empty our cart
function cartItemClickListener(event) {
  const selectedItem = event.target;
  selectedItem.remove();
  const cartParentElement = document.querySelector('.cart__items');
  localStorage.setItem('cartStorage', cartParentElement.innerHTML);
}

const emptyCart = () => {
  const cartParentElement = document.querySelector('.cart__items');
  cartParentElement.innerHTML = '';
  localStorage.removeItem('cartStorage');
};

// create cart list item
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// search product by id on API
const fetchProduct = (productId) => {
  const productEndpoint = `items/${productId}`;
  const productSearch = `${base}${productEndpoint}`;

  fetch(productSearch)
    .then(response => response.json())
    .then((data) => {
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(
        createCartItemElement({ sku: data.id, name: data.title, salePrice: data.price }),
      );
      console.log(localStorage.setItem('cartStorage', cartList.innerHTML));
    });
};

// get item's id
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// call previous func to get item id from parent element when click on 'Adicione ao Carrinho' button
// and add the item to user's cart
const getItemToCart = (event) => {
  const item = (event.target).parentElement;
  const id = getSkuFromProductItem(item);

  fetchProduct(id);
};

// create custom html elements
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  // add event listener product list buttons
  if (element === 'button') {
    e.addEventListener('click', getItemToCart);
  }
  return e;
}

// create html item to main product list
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// iterate product list from ML'S api to create our own list
const mblProducts = (results) => {
  results.forEach((result) => {
    const product = { sku: result.id, name: result.title, image: result.thumbnail };
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
};

window.onload = function onload() {
  // fetch product list from mercado livre's api on window load and calls mblProducts function
  const endpoint = 'sites/MLB/search?q=$computador';
  const fetchComputer = (url) => {
    fetch(url)
      .then(response => response.json())
      .then(data => mblProducts(data.results));
  };
  fetchComputer(`${base}${endpoint}`);

  // add event to empty our cart
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);

  // call local storage to load saved our cart
  const loadCart = () => {
    const cartParentElement = document.querySelector('.cart__items');
    cartParentElement.innerHTML = localStorage.getItem('cartStorage');
    const cartListItems = document.getElementsByTagName('li');
    for (let i = 0; i < cartListItems.length; i += 1) {
      cartListItems[i].addEventListener('click', cartItemClickListener);
    }
  };

  loadCart();
};
