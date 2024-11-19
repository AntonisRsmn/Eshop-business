// Product Data (Simulated)
const products = [
    {
        id: 1,
        name: 'Product 1',
        price: '€25.00',
        description: 'Description for Product 1',
        image: 'https://via.placeholder.com/400x400'
    },
    {
        id: 2,
        name: 'Product 2',
        price: '€30.00',
        description: 'Description for Product 2',
        image: 'https://via.placeholder.com/400x400'
    },
    {
        id: 3,
        name: 'Product 3',
        price: '€20.00',
        description: 'Description for Product 3',
        image: 'https://via.placeholder.com/400x400'
    }
];

// Utility Functions
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function calculateCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = calculateCartCount();
    }
}

// Add product to the cart
function addToCart(product) {
    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    document.dispatchEvent(new Event('cartUpdated'));
    alert(`${product.name} has been added to your cart!`);
}

// Load Product Details (for Product Page)
function loadProductDetails() {
    const queryParams = new URLSearchParams(window.location.search);
    const productId = parseInt(queryParams.get('id'), 10);

    if (isNaN(productId)) {
        alert('Invalid product ID!');
        window.location.href = 'index.html'; // Redirect to a safe page
    } else {
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = product.price;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-image').src = product.image;

            const addToCartButton = document.getElementById('add-to-cart');
            if (addToCartButton) {
                addToCartButton.addEventListener('click', () => addToCart(product));
            }
        } else {
            alert('Product not found!');
            window.location.href = 'index.html'; // Redirect if product not found
        }
    }
}

// Populate Cart Page
function populateCartPage() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        const cart = getCart();

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="4">Your cart is empty.</td></tr>';
        } else {
            cart.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>${(parseFloat(item.price.replace('€', '').trim()) * item.quantity).toFixed(2)} €</td>
                `;
                cartItemsContainer.appendChild(row);
            });
        }
    }
}

// Add-to-Cart from Product List
function enableAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'), 10);
            const product = products.find(p => p.id === productId);

            if (product) {
                addToCart(product);
            } else {
                alert('Error: Product not found.');
            }
        });
    });
}

// Initialize Script
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    document.addEventListener('cartUpdated', updateCartCount);

    // Check for specific page logic
    if (document.getElementById('product-name')) {
        loadProductDetails();
    }

    if (document.getElementById('cart-items')) {
        populateCartPage();
    }

    enableAddToCartButtons();
}); 
