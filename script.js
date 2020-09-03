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
  // coloque seu código aqui ok
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function productId(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then(({id, title, price}) => {
      // retornar essas propriedades
      const addedProductOnCart = createCartItemElement({
        sku: id,
        name: title,
        salePrice: price,
      });
    // onde serão appendados na 
    //seção do carrinho de 
    //compras apos ser chamado
    // no fetch 1 após criação 
    //do ol no index.html
        document.querySelector('.cart__items').appendChild(addedProductOnCart);
    });
  }

function fetchMercadoLivre() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((object) => {
      object.results.forEach(({ id, title, thumbnail }) => {
        // results done
        const product = createProductItemElement({
          sku: id,
          name: title,
          image: thumbnail
        });
          product.addEventListener('click', (event) =>{
            if(event.target.className === 'item__add'){
              productId(getSkuFromProductItem(event.target.parentElement));
          }
        })
        // retrieve images done
        document.querySelector('.items').appendChild(product);
        // adição das imagens
      });
    });
}
window.onload = function onload() {
  fetchMercadoLivre();
};
