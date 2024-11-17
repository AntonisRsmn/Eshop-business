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

// Load Product Details
const queryParams = new URLSearchParams(window.location.search);
const productId = parseInt(queryParams.get('id'), 10);

if (productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = product.price;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-image').src = product.image;

        // Add to Cart Functionality
        document.getElementById('add-to-cart').addEventListener('click', function () {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${product.name} has been added to your cart!`);
        });
    } else {
        alert('Product not found!');
    }
} else {
    alert('No product selected!');
}
