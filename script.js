document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('galleryContainer');
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
        }
    }

    function renderGallery() {
        container.innerHTML = '';

        photos.forEach((photo) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = photo.url;
            img.alt = photo.caption || 'Pooleside photo';
            img.loading = 'lazy';

            item.appendChild(img);
            container.appendChild(item);
        });
    }

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
            let response = await fetch('/api/tracks');
            if (!response.ok) {
                // Fallback for simple local servers without Cloudflare Pages Functions
                response = await fetch('tracks.json');
            }
            if (!response.ok) throw new Error('Failed to load tracks configuration');
            
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
