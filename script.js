window.onload = function onload() {
  fetchMercadoLivre();
};
const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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
}

function cartItemClickListener(event) {
 // coloque seu código aqui
}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function fetchMercadoLivre() {
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      object.results.forEach(({ id, title, thumbnail }) => {
        // results done
        const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
        // retrieve images done
        document.querySelector('.items').appendChild(item);
        // adição das imagens
      });
    });
}

