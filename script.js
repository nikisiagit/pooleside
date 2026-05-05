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

        // Track the highest z-index to bring cards to front
        let highestZIndex = photos.length;

        photos.forEach((photo, index) => {
            const layout = layouts[index % layouts.length];

            // Main Window Card
            const card = document.createElement('div');
            card.className = 'finetooth-card';
            // Alternating horizontal positions removed to center cards
            // card.style.left = layout.left;
            card.style.zIndex = index + 1; // Natural stacking order
            card.dataset.speed = layout.speed;

            // Click to bring to front
            card.addEventListener('click', () => {
                highestZIndex++;
                card.style.zIndex = highestZIndex;
            });

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

    // --- Radio Player Logic ---
    const radioPlayBtn = document.getElementById('navRadioPlayBtn');
    const radioPlayIcon = document.getElementById('navRadioPlayIcon');
    const radioTrackName = document.getElementById('navRadioTrackName');
    
    let tracks = [];
    let totalPlaylistDuration = 0;
    let currentTrackIndex = -1;
    let radioAudio = new Audio();
    
    async function loadTracks() {
        try {
            const response = await fetch('tracks.json');
            if (!response.ok) throw new Error('Failed to load tracks.json');
            tracks = await response.json();
            
            totalPlaylistDuration = tracks.reduce((acc, track) => acc + (track.duration || 0), 0);
            
            if (tracks.length > 0 && totalPlaylistDuration > 0) {
                syncRadio(false);
                
                setInterval(() => {
                    if (radioAudio.paused) {
                        syncRadio(false);
                    }
                }, 10000);
            } else {
                radioTrackName.textContent = 'No tracks available';
            }
        } catch (error) {
            console.error('Error loading tracks:', error);
            radioTrackName.textContent = 'Offline';
        }
    }

    function syncRadio(playAfterSync = false) {
        if (!tracks || tracks.length === 0 || totalPlaylistDuration === 0) return;
        
        const nowSec = Math.floor(Date.now() / 1000);
        let playlistPos = nowSec % totalPlaylistDuration;
        
        let targetTrackIndex = 0;
        let offsetInTrack = 0;
        
        let accumulatedTime = 0;
        for (let i = 0; i < tracks.length; i++) {
            if (playlistPos >= accumulatedTime && playlistPos < accumulatedTime + tracks[i].duration) {
                targetTrackIndex = i;
                offsetInTrack = playlistPos - accumulatedTime;
                break;
            }
            accumulatedTime += tracks[i].duration;
        }
        
        const track = tracks[targetTrackIndex];
        
        if (currentTrackIndex !== targetTrackIndex) {
            currentTrackIndex = targetTrackIndex;
            radioTrackName.textContent = `${track.artist} - ${track.title}`;
            radioAudio.src = track.url;
            
            setTimeout(() => {
                if (radioTrackName.offsetWidth > radioTrackName.parentElement.offsetWidth) {
                    radioTrackName.classList.add('scroll');
                } else {
                    radioTrackName.classList.remove('scroll');
                }
            }, 100);
        }
        
        if (playAfterSync || radioAudio.paused) {
             radioAudio.currentTime = offsetInTrack;
        }
        
        if (playAfterSync) {
            radioAudio.play().catch(e => console.error("Playback failed:", e));
            radioPlayIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        }
    }

    function togglePlay() {
        if (!tracks || tracks.length === 0) return;
        
        if (radioAudio.paused) {
            syncRadio(true);
        } else {
            radioAudio.pause();
            radioPlayIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>'; // Play icon
        }
    }

    if (radioPlayBtn) {
        radioPlayBtn.addEventListener('click', togglePlay);
    }

    radioAudio.addEventListener('ended', () => {
        syncRadio(true);
    });

    loadTracks();
    // --- End Radio Player Logic ---

    loadPhotos();
});
