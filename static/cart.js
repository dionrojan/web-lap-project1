// Grab the empty container and the total price span from our HTML
const cartContainer = document.getElementById('cart-items-container');
const cartTotalElement = document.getElementById('cart-total');

// Create a function to draw the cart so we can re-run it easily when things change
function renderCart() {
    // 1. Get the cart from memory
    let cart = JSON.parse(localStorage.getItem('shoeStoreCart')) || [];
    
    // Clear out the container before we redraw
    cartContainer.innerHTML = '';
    let grandTotal = 0;

    // 2. If the cart is empty, show a message
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is currently empty.</p>';
        cartTotalElement.innerText = '0.00';
        return; // Stop running the function
    }

    // 3. Loop through the saved items and create HTML for them
    cart.forEach((item, index) => {
        // Calculate the total for this specific shoe type
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal; // Add it to the grand total

        // Create a new div for the item
        const itemRow = document.createElement('div');
        itemRow.classList.add('cart-item');
        
        // Inject the data using a Template Literal (the backticks ` ` let us put variables inside)
        itemRow.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-img">
            <div class="cart-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-actions">
                <p>Qty: ${item.quantity}</p>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
            <div class="cart-item-total">
                <h4>$${itemTotal.toFixed(2)}</h4>
            </div>
        `;
        
        cartContainer.appendChild(itemRow);
    });

    // 4. Update the big total at the bottom
    cartTotalElement.innerText = grandTotal.toFixed(2);
}

// Function to remove an item when the "Remove" button is clicked
function removeItem(indexToRemove) {
    let cart = JSON.parse(localStorage.getItem('shoeStoreCart')) || [];
    
    // Remove 1 item at the specific index position
    cart.splice(indexToRemove, 1);
    
    // Save the new list back to memory
    localStorage.setItem('shoeStoreCart', JSON.stringify(cart));
    
    // Redraw the cart to show it's gone!
    renderCart();
}

// Run the render function as soon as the page loads
renderCart();