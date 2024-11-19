// SideBar
function showSidebar () {
    const sidebar = document.querySelector(".sidenav")
    sidebar.style.display = "flex"
}

function hideSidebar () {
    const sidebar = document.querySelector(".sidenav")
    sidebar.style.display = "none"
}  

document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');

    // Function to update the cart count in the navbar
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }

    // Call the function to set the initial count on page load
    updateCartCount();

    // Custom event to refresh the count dynamically
    document.addEventListener('cartUpdated', updateCartCount);

    // Add-to-Cart Button Logic (works for both index.html and product.html)
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Extract product data from the button's data attributes or the page
            const product = {
                name: button.getAttribute('data-name') || document.getElementById('product-name').textContent,
                price: button.getAttribute('data-price') || document.getElementById('product-price').textContent,
                image: button.getAttribute('data-image') || document.getElementById('product-image').src,
                quantity: 1
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProduct = cart.find(item => item.name === product.name);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            document.dispatchEvent(new Event('cartUpdated'));
        });
    });

    // Cart Page Logic (specific to cart.html)
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="4">Your cart is empty.</td></tr>';
        } else {
            cart.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                    <td>${(parseFloat(item.price.replace('€', '').trim()) * item.quantity).toFixed(2)} €</td>
                `;
                cartItemsContainer.appendChild(row);
            });
        }
    }
});