document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriterText');
    const bottomLogo = document.getElementById('bottomLogo');
    const waitlistContent = document.getElementById('waitlistContent');
    const waitlistForm = document.getElementById('waitlistForm');
    const waitlistMessage = document.getElementById('waitlistMessage');
    const photosContainer = document.getElementById('icloudPhotosContainer');

    if (!textElement) return;

    // Text parts
    const part1 = "Celebrating life in Poole and surrounding coastline ";
    const part2 = "through music and photography";

    let index1 = 0;
    let index2 = 0;
    const speed = 100; // slightly faster for longer text

    function typePart1() {
        if (index1 < part1.length) {
            textElement.textContent += part1.charAt(index1);
            index1++;
            setTimeout(typePart1, speed);
        } else {
            // Part 1 done, wait short delay
            setTimeout(typePart2, 500);
        }
    }

    function typePart2() {
        if (index2 < part2.length) {
            textElement.textContent += part2.charAt(index2);
            index2++;
            setTimeout(typePart2, speed);
        } else {
            // All text done.
            // 1. Show Logo after 1s
            setTimeout(() => {
                if (bottomLogo) bottomLogo.style.opacity = '1';

                // 2. Show Waitlist Form and photos after Logo has faded in (e.g. +1.5s)
                setTimeout(() => {
                    if (waitlistContent) waitlistContent.style.opacity = '1';
                    loadPhotos();
                }, 1500);

            }, 1000);
        }
    }

    // Wait 3 seconds initially
    setTimeout(typePart1, 3000);

    // Fetch and load photos
    async function loadPhotos() {
        if (!photosContainer) return;
        try {
            const res = await fetch('photos.json');
            if (!res.ok) return;
            const photos = await res.json();
            
            // Limit to 6 or 9 photos for the hero grid
            const displayPhotos = photos.slice(0, 6);
            
            displayPhotos.forEach((photo, idx) => {
                const photoItem = document.createElement('div');
                photoItem.className = 'photo-item';
                if (idx === 0) photoItem.classList.add('photo-tall');
                if (idx === 3) photoItem.classList.add('photo-wide');
                
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
                
                photosContainer.appendChild(photoItem);
            });
            
            photosContainer.style.opacity = '1';
            
        } catch (err) {
            console.error('Error loading photos:', err);
        }
    }

    // Waitlist form submission
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('waitlistEmail');
            if (emailInput && emailInput.value) {
                waitlistForm.style.display = 'none';
                waitlistMessage.textContent = "You're on the list. We'll be in touch.";
                waitlistMessage.style.display = 'block';
            }
        });
    }
});
