const apiUrl = 'https://api.mercadolibre.com/';
const apiUrlSearch = 'sites/MLB/search?q=$computador';
const apiUrlItemCart = 'items/';

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  //  li.addEventListener('click', cartItemClickListener);
  return li;
}

const searchHandler = (id) => {
  const url = `${apiUrl}${apiUrlItemCart}${id}`;
  fetch(url)
    .then(response => response.json())
    .then((element) => {
      const object = {
        sku: element.id,
        name: element.title,
        salePrice: element.price,
      };
      const newItem = createCartItemElement(object);
      const section = document.querySelector('.cart__items');
      section.appendChild(newItem);
      console.log(newItem);
    });
};

const buttonHandler = () => {
  const element = event.path[1];
  const id = element.firstElementChild.innerText;
  searchHandler(id);
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAdd.addEventListener('click', buttonHandler);
  section.appendChild(buttonAdd);

  return section;
}

//  function getSkuFromProductItem(item) {
//    return item.querySelector('span.item__sku').innerText;
//  }
//  function cartItemClickListener(event) {
//    // coloque seu código aqu
//  }

const handleResults = (results) => {
  results.forEach((element) => {
    const object = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const newItem = createProductItemElement(object);
    const section = document.querySelector('.items');
    section.appendChild(newItem);
  });
};

const apiHandlers = (url) => {
  fetch(url)
    .then(response => response.json())
    .then(object => handleResults(object.results));
};

window.onload = function onload() {
  apiHandlers(`${apiUrl}${apiUrlSearch}`);
};
