document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('coverFlowContainer');
    if (!container) return;

    let photos = [];

    // Predefined layout positions for a scattered, editorial look
    // Each entry: { left (%), top offset (px), width (px), speed (parallax multiplier) }
    const layouts = [
        { left: 55, width: 420, speed: 0.6 },
        { left: 15, width: 380, speed: 0.45 },
        { left: 45, width: 350, speed: 0.55 },
        { left: 5,  width: 400, speed: 0.35 },
        { left: 35, width: 440, speed: 0.5 },
        { left: 60, width: 360, speed: 0.4 },
        { left: 10, width: 420, speed: 0.55 },
        { left: 50, width: 380, speed: 0.45 },
        { left: 20, width: 400, speed: 0.6 },
        { left: 55, width: 350, speed: 0.35 },
        { left: 5,  width: 430, speed: 0.5 },
        { left: 40, width: 370, speed: 0.45 },
        { left: 15, width: 410, speed: 0.55 },
        { left: 60, width: 390, speed: 0.4 },
        { left: 30, width: 420, speed: 0.5 },
        { left: 10, width: 380, speed: 0.6 },
        { left: 50, width: 400, speed: 0.45 },
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

        // Total vertical spacing between cards
        const cardSpacing = 500;

        photos.forEach((photo, index) => {
            const layout = layouts[index % layouts.length];

            // Glass card wrapper
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.width = layout.width + 'px';
            card.style.left = layout.left + '%';
            card.style.top = (index * cardSpacing) + 'px';
            card.dataset.speed = layout.speed;

            // Image inside the card
            const img = document.createElement('div');
            img.className = 'glass-card-image';
            img.style.backgroundImage = `url('${photo.url}')`;
            
            // Aspect ratio based on photo metadata
            const aspect = (photo.height && photo.width) 
                ? (photo.height / photo.width) 
                : 0.65;
            img.style.paddingBottom = (Math.min(aspect, 0.75) * 100) + '%';

            card.appendChild(img);
            container.appendChild(card);
        });

        // Set the container/body height for scrolling
        const totalHeight = photos.length * cardSpacing + window.innerHeight;
        container.style.height = totalHeight + 'px';
        document.body.style.height = (totalHeight + 200) + 'px';

        updatePositions();
    }

    function updatePositions() {
        const scrollY = window.scrollY;
        const cards = container.querySelectorAll('.glass-card');

        cards.forEach((card) => {
            const speed = parseFloat(card.dataset.speed);
            const offset = scrollY * speed;
            card.style.transform = `translateY(${-offset}px)`;
        });
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updatePositions);
    });

    loadPhotos();
});
