document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('coverFlowContainer');
    if (!container) return;

    let photos = [];

    // Predefined layouts to create the scattered, overlapping column
    const layouts = [
        { left: '10%', zIndex: 1, speed: 0.05 },
        { left: '50%', zIndex: 2, speed: 0.15 },
        { left: '20%', zIndex: 3, speed: 0.08 },
        { left: '60%', zIndex: 4, speed: 0.12 },
        { left: '5%',  zIndex: 5, speed: 0.04 },
        { left: '40%', zIndex: 6, speed: 0.10 },
        { left: '70%', zIndex: 7, speed: 0.18 },
        { left: '15%', zIndex: 8, speed: 0.06 },
    ];

    async function loadPhotos() {
        try {
            const response = await fetch('photos.json');
            if (!response.ok) throw new Error('Failed to load photos.json');
            photos = await response.json();
            renderGallery();
        } catch (error) {
            console.error('Error loading photos:', error);
        }
    }

    function renderGallery() {
        container.innerHTML = '';

        photos.forEach((photo, index) => {
            const layout = layouts[index % layouts.length];

            // Main Window Card
            const card = document.createElement('div');
            card.className = 'finetooth-card';
            // Alternating horizontal positions
            card.style.left = layout.left;
            card.style.zIndex = index + 1; // Natural stacking order
            card.dataset.speed = layout.speed;

            // MacOS-style Header Bar
            const header = document.createElement('div');
            header.className = 'finetooth-card-header';
            
            const title = document.createElement('span');
            title.className = 'finetooth-card-title';
            // Default to a generic name or extract from filename if possible
            const filename = photo.url.split('/').pop().split('.')[0] || `photo-${index + 1}`;
            title.textContent = filename.replace(/-/g, ' ').toLowerCase();

            header.appendChild(title);

            // Image Container
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'finetooth-card-image-wrapper';
            
            const img = document.createElement('img');
            img.className = 'finetooth-card-image';
            img.src = photo.url;
            img.alt = title.textContent;
            // Lazy load for performance
            img.loading = 'lazy';

            imgWrapper.appendChild(img);

            card.appendChild(header);
            card.appendChild(imgWrapper);
            container.appendChild(card);
        });

        // Initial position update
        updatePositions();
    }

    function updatePositions() {
        const scrollY = window.scrollY;
        const cards = container.querySelectorAll('.finetooth-card');

        cards.forEach((card) => {
            const speed = parseFloat(card.dataset.speed);
            // Translate Y for parallax. Negative moves it up faster as you scroll down
            const offset = scrollY * speed;
            card.style.transform = `translateY(${-offset}px)`;
        });
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updatePositions);
    });

    loadPhotos();
});
