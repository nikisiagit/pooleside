document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('coverFlowContainer');
    if (!container) return;

    let photos = [];

    async function loadPhotos() {
        try {
            const response = await fetch('photos.json');
            if (!response.ok) throw new Error('Failed to load photos.json');
            photos = await response.json();
            renderGallery();
        } catch (error) {
            console.error('Error loading photos:', error);
            container.innerHTML = '<p style="color: red;">Failed to load gallery.</p>';
        }
    }

    function renderGallery() {
        container.innerHTML = '';
        photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'cover-item';
            item.style.backgroundImage = `url('${photo.url}')`;
            container.appendChild(item);
        });
        // Set body height to allow enough scroll room
        // Each photo gets ~200px of scroll travel
        const scrollHeight = photos.length * 250 + window.innerHeight;
        document.body.style.height = scrollHeight + 'px';
        updatePositions();
    }

    function updatePositions() {
        const items = container.querySelectorAll('.cover-item');
        const total = items.length;
        if (total === 0) return;

        const scrollY = window.scrollY;
        const viewportH = window.innerHeight;

        // Map scroll position to a floating "active index"
        // Each 250px of scroll advances one image
        const rawIndex = scrollY / 250;
        // Wrap around for looping
        const activeFloat = ((rawIndex % total) + total) % total;

        items.forEach((item, index) => {
            // Calculate the shortest wrapped distance from activeFloat to this index
            let diff = index - activeFloat;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            // Scale: center = 1, fades to 0.55 at edges
            const absDiff = Math.abs(diff);
            const scale = Math.max(0.55, 1 - absDiff * 0.15);

            // Translate X: spread items apart horizontally
            const tx = diff * 320;

            // Opacity: fade far-away items
            const opacity = Math.max(0, 1 - absDiff * 0.25);

            // Z-index: center item on top
            const zIndex = Math.round(100 - absDiff * 10);

            // Rotation: slight Y rotation for depth
            const rotateY = diff * -12;

            item.style.transform = `translateX(${tx}px) scale(${scale}) rotateY(${rotateY}deg)`;
            item.style.opacity = opacity;
            item.style.zIndex = zIndex;
        });
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updatePositions);
    });

    loadPhotos();
});
