'use strict';
//CART BUTTON
/* const addToCartbtn = document.querySelectorAll('.essence-btn');
let cartListSideBar = document.querySelector('.cart-list');
const insideCount = document.getElementById('insideCount');
const count = document.getElementById('count');
const carouselSlideImagesContainer = document.querySelector('.owl-stage-outer');
const newArrival = document.querySelector('new_arrivals_area ');

addToCartbtn.forEach((cart) => {
  cart.addEventListener('click', function () {
    const productCart = cart.closest('.single-product-wrapper');
    newArrival.textContent = carouselSlideImagesContainer;
    cartListSideBar.appendChild(productCart);
  });
});
 */

/* document.addEventListener('DOMContentLoaded', function () {
  const cartList = document.querySelector('.cart-list');
  const countSpan = document.getElementById('count');
  let cartCount = 0;

  // Find all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn .btn');

  addToCartButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      // Get the product wrapper
      const productWrapper = btn.closest('.single-product-wrapper');

      if (!productWrapper) return;

      // Extract product details
      const title =
        productWrapper.querySelector('h6')?.textContent || 'No title';
      const brand =
        productWrapper.querySelector('span')?.textContent || 'No brand';
      const price =
        productWrapper.querySelector('.product-price')?.textContent ||
        'No price';
      const img = productWrapper.querySelector('.product-img img')?.src || '';

      // Create cart item element
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.style.display = 'flex';
      cartItem.style.alignItems = 'center';
      cartItem.style.gap = '10px';
      cartItem.style.marginBottom = '10px';

      cartItem.innerHTML = `
        <img src="${img}" alt="${title}" width="60" height="60" />
        <div>
          <p><strong>${title}</strong></p>
          <p>${brand}</p>
          <p>${price}</p>
        </div>
      `;

      // Append to cart list
      cartList.appendChild(cartItem);

      // Update count
      cartCount++;
      countSpan.textContent = cartCount;
    });
  });
}); */

document.addEventListener('DOMContentLoaded', function () {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn .btn');
  const cartList = document.querySelector('.cart-list');
  const cartCount = document.getElementById('count');

  const successMessage = document.createElement('div');
  successMessage.classList.add('cart-success');
  successMessage.style.cssText =
    'position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 10px 20px; border-radius: 6px; display: none; z-index: 1000;';
  document.body.appendChild(successMessage);

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function showSuccess(msg) {
    successMessage.textContent = msg;
    successMessage.style.display = 'block';
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 2000);
  }

  function updateCartCount() {
    cartCount.textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function calculateTotals() {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.075; // 7.5% tax
    const total = subtotal + tax;

    const totalsHTML = `
      <div class="cart-totals">
      <h2>Summary</h2>
        <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
        <p><strong>Tax (7.5%):</strong> $${tax.toFixed(2)}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
           <a href="checkout.html" class="btn essence-btn">check out</a>
      </div>
    `;

    const oldTotals = document.querySelector('.cart-totals');
    if (oldTotals) oldTotals.remove();

    cartList.insertAdjacentHTML('beforeend', totalsHTML);
  }

  function renderCart() {
    cartList.innerHTML = '';

    cart.forEach((item, index) => {
      cartList.innerHTML += `
        <div class="cart-item" data-index="${index}" style="border-bottom:1px solid #ccc; padding:10px;">
        
          <img src="${
            item.image
          }" width="60" height="60" style="object-fit:cover; margin-right:10px;" />

          <strong>${item.title}</strong>
          <strong> - $${item.price.toFixed(2)} x</strong> 
          <p class='calc'>
            <button class="decrease-qty">−</button> 
          <span class='quantity'>${item.quantity}</span> 
          <button class="increase-qty">+</button>
          </p>
        
          <button class="remove-item" style="color:red; float:right;">Remove</button>
          
        </div>
      `;
    });

    calculateTotals();
    updateCartCount();
    saveCart();
  }

  function addToCart(product) {
    const existing = cart.find((item) => item.title === product.title);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    showSuccess('Product added to cart!');
    renderCart();
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const productWrapper = button.closest('.single-product-wrapper');
      const image = productWrapper.querySelector('img').src;
      const title = productWrapper.querySelector('h6').textContent;
      const priceText = productWrapper
        .querySelector('.product-price')
        .textContent.replace(/[^0-9.]/g, '');
      const price = parseFloat(priceText);

      addToCart({ image, title, price });
    });
  });

  cartList.addEventListener('click', function (e) {
    const itemEl = e.target.closest('.cart-item');
    if (!itemEl) return;

    const index = parseInt(itemEl.getAttribute('data-index'));

    if (e.target.classList.contains('remove-item')) {
      cart.splice(index, 1);
    } else if (e.target.classList.contains('increase-qty')) {
      cart[index].quantity++;
    } else if (e.target.classList.contains('decrease-qty')) {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
      } else {
        cart.splice(index, 1);
      }
    }

    renderCart();
  });

  // Render cart on load
  renderCart();
});

const heroImage = document.querySelector('.welcome_area');
heroImage.addEventListener('click', function () {
  console.log(this);
  this.classList.toggle('toggleHeroImage');
});

// SEARCH AND FILTERING

document
  .querySelector('.search-area form')
  .addEventListener('submit', async function (e) {
    e.preventDefault(); // prevent form from refreshing the page

    const query = document
      .getElementById('headerSearch')
      .value.trim()
      .toLowerCase();

    // Check if user wants female clothes
    if (query.includes('female') || query.includes('women')) {
      try {
        const response = await fetch(
          "https://fakestoreapi.com/products/category/women's clothing"
        );
        const data = await response.json();

        let resultHTML = `
        <html>
        <head>
          <title>Female Clothes Results</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background-color: #f8f8f8;
          
            }
            .product {
              background: white;
              border: 1px solid #ddd;
              padding: 15px;
              margin-bottom: 15px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .product img {
              max-width: 120px;
              height: auto;
              float: left;
              margin-right: 15px;
            }
            .product h2 {
              margin: 0;
              font-size: 18px;
              color: #333;
            }
            .product p {
              margin: 5px 0;
              font-size: 14px;
              color: #555;
            }
            .price {
              font-weight: bold;
              color: #e91e63;
            }
            .clear {
              clear: both;
            }
          </style>
        </head>
        <body>
          <h1>Female Clothing Results</h1>
      `;

        data.forEach((item) => {
          resultHTML += `
          <div class="product">
            <img src="${item.image}" alt="${item.title}" />
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <p class="price">Price: $${item.price}</p>
            <div class="clear"></div>
          </div>
        `;
        });

        resultHTML += `
        </body>
        </html>
      `;

        // Open in a new tab and write the results
        const newTab = window.open();
        newTab.document.write(resultHTML);
        newTab.document.close();
      } catch (error) {
        alert('Error fetching products.');
        console.error(error);
      }
    } else {
      alert("Please search for 'female clothes' to see results.");
    }
  });
