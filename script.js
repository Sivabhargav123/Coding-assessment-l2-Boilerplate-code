const cartList = document.getElementById('cart-list');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');

let cartData = [];

async function fetchCartData() {
  try {
    const response = await fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889');
    const data = await response.json();
    cartData = data.items;
    renderCartItems();
    calculateTotals();
  } catch (error) {
    console.error('Error fetching cart data:', error);
  }
}

function renderCartItems() {
  cartList.innerHTML = '';
  cartData.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.title}" width="50">
      <div class="cartDetails">
        <h4>${item.title}</h4>
        <p> ₹${(item.price / 100).toFixed(2)}</p>
        <input class="CartCount" type="number" min="1" value="${item.quantity}" data-id="${item.id}">
        <button class='button' data-id="${item.id}" class="remove-btn">🗑️</button>
      </div>
    `;
    cartList.appendChild(itemElement);
  });

  document.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', removeItem));
  document.querySelectorAll('input[type="number"]').forEach(input => input.addEventListener('input', updateQuantity));
}

function removeItem(event) {
  const id = event.target.dataset.id;
  cartData = cartData.filter(item => item.id != id);
  renderCartItems();
  calculateTotals();
}

function updateQuantity(event) {
  const id = event.target.dataset.id;
  const quantity = parseInt(event.target.value);
  const item = cartData.find(item => item.id == id);
  if (item) {
    item.quantity = quantity;
    calculateTotals();
  }
}

function calculateTotals() {
  let subtotal = 0;
  cartData.forEach(item => {
    subtotal += (item.price / 100) * item.quantity;
  });
  subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
  totalElement.textContent = `₹${subtotal.toFixed(2)}`;
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  alert('Proceeding to checkout!');
});

fetchCartData();
