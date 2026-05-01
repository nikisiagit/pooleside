document.addEventListener('DOMContentLoaded', () => {
    const heroText = document.getElementById('heroText');
    const bottomLogo = document.getElementById('bottomLogo');
    const photosContainer = document.getElementById('icloudPhotosContainer');
    const galleryTrack = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Fade in text slowly
    setTimeout(() => {
        if (heroText) heroText.style.opacity = '1';
    }, 500);

    // Show Logo after text has faded in (e.g. +3s)
    setTimeout(() => {
        if (bottomLogo) bottomLogo.style.opacity = '1';
        
        // Show photos after Logo has faded in (e.g. +1.5s)
        setTimeout(() => {
            loadPhotos();
        }, 1500);

    }, 3500);

    // Fetch and load photos
    async function loadPhotos() {
        if (!photosContainer || !galleryTrack) return;
        try {
            const res = await fetch('photos.json');
            if (!res.ok) return;
            const photos = await res.json();
            
            photos.forEach((photo) => {
                const photoItem = document.createElement('div');
                photoItem.className = 'gallery-item';
                
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
                
                galleryTrack.appendChild(photoItem);
            });
            
            photosContainer.style.opacity = '1';
            
            // Set up scrolling
            if (prevBtn && nextBtn) {
                const scrollAmount = 320; // width of item + gap
                
                prevBtn.addEventListener('click', () => {
                    galleryTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                });
                
                nextBtn.addEventListener('click', () => {
                    galleryTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                });
            }
            
        } catch (err) {
            console.error('Error loading photos:', err);
        }
    }
});
