// =========================================
// 1. SCROLL ANIMATION LOGIC
// =========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // If the user scrolls down to the shoe card, add the 'is-visible' class
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.1 }); // Triggers when 10% of the card is visible

// Grab all shoe cards and watch them for scrolling
const popElements = document.querySelectorAll('.pop-on-scroll');
popElements.forEach((el) => observer.observe(el));


// =========================================
// 2. FILTERING LOGIC (MEN/WOMEN/ALL)
// =========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        
        // Prevent the link from jumping to the top of the page
        e.preventDefault(); 

        // Figure out which category was clicked (e.g., "men", "women", or "all")
        const filterValue = this.getAttribute('data-filter');

        // Loop through every single shoe card
        productCards.forEach(card => {
            
            // Check what category this specific shoe belongs to
            const shoeCategory = card.getAttribute('data-category');

            // If the filter is "all", or if the shoe matches the clicked category...
            if (filterValue === 'all' || filterValue === shoeCategory) {
                // Show it (remove the hidden class)
                card.classList.remove('hidden');
            } else {
                // Otherwise, hide it!
                card.classList.add('hidden');
            }
        });
    });
});