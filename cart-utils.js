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

    // Add-to-Cart Button Logic
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const name = event.target.getAttribute('data-name');
            const price = event.target.getAttribute('data-price');
            const image = event.target.getAttribute('data-image').replace('../', ''); // Fix image path
            const code = event.target.getAttribute('data-code');
            const color = event.target.getAttribute('data-color'); // Add color
            const model = event.target.getAttribute('data-model'); // Add model

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.code === code);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, image, code, color, model, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        });
    });

    // Cart Page Logic
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    if (cartItemsContainer) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Cart Data:', cart); // Debugging log

        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-item empty">Your cart is empty.</div>';
            checkoutButton.style.display = 'none';
        } else {
            cart.forEach((item, index) => {
                console.log(`Rendering item: ${item.name}, Quantity: ${item.quantity}`); // Debugging log

                const itemTotal = parseFloat(item.price.replace('€', '')) * item.quantity;
                total += itemTotal;

                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Color: ${item.color}</p>
                        <p>Code: ${item.code}</p>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Total: €${itemTotal.toFixed(2)}</p>
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            cartTotalElement.textContent = total.toFixed(2);
            checkoutButton.style.display = 'block';
        }

        // Add remove functionality
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'), 10);
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                window.location.reload();
            });
        });
    }
});