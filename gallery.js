document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('galleryGrid');

    async function loadPhotos() {
        if (!galleryGrid) return;
        try {
            const res = await fetch('photos.json');
            if (!res.ok) return;
            const photos = await res.json();
            
            photos.forEach((photo, idx) => {
                const photoItem = document.createElement('div');
                photoItem.className = 'photo-item';
                
                // Add some variety to the grid layout just like the original photos grid
                if (idx % 7 === 0) photoItem.classList.add('photo-tall');
                if (idx % 5 === 0 && idx !== 0) photoItem.classList.add('photo-wide');
                
                const img = document.createElement('img');
                img.src = photo.url;
                img.alt = photo.caption || 'pooleside vibe';
                img.loading = 'lazy';
                
                photoItem.appendChild(img);
                
                if (photo.caption) {
                    const overlay = document.createElement('div');
                    overlay.className = 'photo-overlay';
                    const location = document.createElement('span');
                    location.className = 'photo-location';
                    location.textContent = photo.caption;
                    overlay.appendChild(location);
                    photoItem.appendChild(overlay);
                }
                
                galleryGrid.appendChild(photoItem);
            });
            
            // Fade in the grid
            setTimeout(() => {
                galleryGrid.style.opacity = '1';
            }, 100);
            
        } catch (err) {
            console.error('Error loading gallery photos:', err);
        }
    }

    loadPhotos();

    // Burger Menu Logic
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
});
