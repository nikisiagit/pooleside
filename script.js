document.addEventListener('DOMContentLoaded', () => {
    // Burger Menu Logic
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Cover Flow Logic
    const container = document.getElementById('coverFlowContainer');
    if (!container) return;

    let photos = [];
    let currentIndex = 0;

    async function loadPhotos() {
        try {
            const response = await fetch('photos.json');
            if (!response.ok) throw new Error('Failed to load photos.json');
            photos = await response.json();
            
            if (photos.length > 0) {
                // Set initial active item to middle of array, or 0
                currentIndex = Math.floor(photos.length / 2);
            }
            renderCoverFlow();
        } catch (error) {
            console.error('Error loading photos:', error);
            container.innerHTML = '<p style="color: red;">Failed to load gallery.</p>';
        }
    }

    function renderCoverFlow() {
        container.innerHTML = '';
        photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'cover-item';
            item.style.backgroundImage = `url('${photo.url}')`;
            
            // Click to navigate
            item.addEventListener('click', () => {
                currentIndex = index;
                updateClasses();
            });

            container.appendChild(item);
        });
        updateClasses();
    }

    function updateClasses() {
        const items = container.querySelectorAll('.cover-item');
        items.forEach((item, index) => {
            item.className = 'cover-item'; // Reset classes
            
            const diff = index - currentIndex;
            
            if (diff === 0) {
                item.classList.add('active');
            } else if (diff === -1) {
                item.classList.add('prev-1');
            } else if (diff === -2 || diff < -2) {
                // Keep others stacked if desired, or just let them hide
                item.classList.add('prev-2');
            } else if (diff === 1) {
                item.classList.add('next-1');
            } else if (diff === 2 || diff > 2) {
                item.classList.add('next-2');
            }
        });
    }

    loadPhotos();
});
