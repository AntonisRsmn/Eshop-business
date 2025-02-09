// SideBar
function showSidebar() {
    const sidebar = document.querySelector(".sidenav");
    sidebar.style.display = "flex";
}

function hideSidebar() {
    const sidebar = document.querySelector(".sidenav");
    sidebar.style.display = "none";
}

document.addEventListener('DOMContentLoaded', () => {
    const cartCountElements = document.querySelectorAll('.cart-count');

    // Function to update the cart count in the navbar
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Call the function to set the initial count on page load
    updateCartCount();

    // Custom event to refresh the count dynamically
    document.addEventListener('cartUpdated', updateCartCount);

    // Add-to-Cart Button Logic (works for both index.html and product.html)
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const name = event.target.getAttribute('data-name');
            const price = event.target.getAttribute('data-price');
            const image = event.target.getAttribute('data-image');
            const code = event.target.getAttribute('data-code'); // Ensure the product code is captured

            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, image, code, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
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