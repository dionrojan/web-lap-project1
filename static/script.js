// =========================================
// 1. SCROLL ANIMATION LOGIC
// =========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.1 });

// Grab the initial shoe cards and watch them
const initialElements = document.querySelectorAll('.pop-on-scroll');
initialElements.forEach((el) => observer.observe(el));


// =========================================
// 2. FILTERING LOGIC 
// =========================================
const filterButtons = document.querySelectorAll('.filter-btn');
let currentFilter = 'all'; // Keeps track of what filter is currently active

filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault(); 
        currentFilter = this.getAttribute('data-filter');
        applyFilter(); // Call the helper function below
    });
});

// We moved the hiding logic into a reusable function so our newly 
// cloned "infinite scroll" shoes can be filtered too!
function applyFilter() {
    // We re-query all cards because new ones might have been added!
    const allProductCards = document.querySelectorAll('.product-card');
    
    allProductCards.forEach(card => {
        const shoeCategory = card.getAttribute('data-category');
        if (currentFilter === 'all' || currentFilter === shoeCategory) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}


// =========================================
// 3. INFINITE SCROLL LOGIC
// =========================================
const grid = document.querySelector('.product-grid');

// Take a "snapshot" of the original 12 cards to use as our cloning templates
const originalCards = Array.from(document.querySelectorAll('.product-card')); 

let isLoading = false; // Prevents the code from firing 100 times a second

window.addEventListener('scroll', () => {
    // Calculate how close the user is to the bottom of the page
    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomPosition = document.body.offsetHeight - 300; // Trigger 300px before the exact bottom

    // If they hit the trigger zone and we aren't already loading...
    if (scrollPosition >= bottomPosition && !isLoading) {
        isLoading = true;
        
        // Add a tiny delay so it feels natural, like the browser is "fetching" data
        setTimeout(() => {
            loadMoreProducts();
            isLoading = false;
        }, 200); 
    }
});

function loadMoreProducts() {
    // NEW: Make a copy of our original cards and shuffle them randomly!
    const shuffledCards = [...originalCards].sort(() => Math.random() - 0.5);

    // Loop through our newly shuffled pile instead of the original one
    shuffledCards.forEach(card => {
        // 1. Deep clone the HTML of the card
        const newCard = card.cloneNode(true);
        
        // 2. Strip away the 'is-visible' class so it resets and pops in smoothly
        newCard.classList.remove('is-visible');
        
        // 3. Stick it onto the end of the grid
        grid.appendChild(newCard);
        
        // 4. Tell our IntersectionObserver to watch this brand new card
        observer.observe(newCard);
    });
    
    // 5. Instantly apply the active Men/Women filter to the new clones
    applyFilter();
}

// =========================================
// 4. ADD TO CART LOGIC
// =========================================
// Grab all the "Add to Cart" buttons
const cartButtons = document.querySelectorAll('.cta-button');

cartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        // 1. Find the parent card of the button that was clicked
        const card = e.target.closest('.product-card');
        
        // 2. Scrape the shoe data from the HTML
        const shoeName = card.querySelector('h3').innerText;
        // Grab the price text, remove the '$', and turn it into a real number
        const shoePrice = parseFloat(card.querySelector('p').innerText.replace('$', ''));
        const shoeImage = card.querySelector('img').getAttribute('src');

        // 3. Create our "Shoe Object"
        const shoeItem = {
            name: shoeName,
            price: shoePrice,
            image: shoeImage,
            quantity: 1
        };

        // 4. Check memory: Do we already have a cart saved? If not, make an empty list []
        let cart = JSON.parse(localStorage.getItem('shoeStoreCart')) || [];

        // 5. Check if this exact shoe is already in the cart
        const existingItem = cart.find(item => item.name === shoeName);
        
        if (existingItem) {
            // If it is, just add 1 to the quantity
            existingItem.quantity += 1;
        } else {
            // If it isn't, add our new shoe object to the list
            cart.push(shoeItem);
        }

        // 6. Save the updated list back into the browser's memory
        localStorage.setItem('shoeStoreCart', JSON.stringify(cart));

        // 7. Visual Feedback: Change button text temporarily so the user knows it worked!
        const originalText = button.innerText;
        button.innerText = "Added!";
        button.style.backgroundColor = "green";
        
        setTimeout(() => {
            button.innerText = originalText;
            button.style.backgroundColor = ""; // Resets back to your CSS default
        }, 1000);
    });
});