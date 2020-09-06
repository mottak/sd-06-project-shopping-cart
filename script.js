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

function createItemList() {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(api).then(response => response.json()).then(data => data.results.forEach((computer) => {
    const product = {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
    };
    const productList = document.querySelector('.items');
    productList.appendChild(createProductItemElement(product));
  }));
}

window.onload = function onload() {
  createItemList();
};
