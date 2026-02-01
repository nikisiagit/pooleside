document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Audio Player Logic (Simulation)
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const playerArtwork = document.querySelector('.featured-player');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    // const totalTimeEl = document.getElementById('totalTime'); // unused
    // const volumeSlider = document.getElementById('volumeSlider'); // unused

    let isPlaying = false;
    let currentProgress = 0;
    let trackDuration = 58 * 60 + 32; // 58:32 in seconds
    let progressInterval;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function togglePlay() {
        isPlaying = !isPlaying;

        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playerArtwork.classList.add('playing');
            startProgress();
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            playerArtwork.classList.remove('playing');
            stopProgress();
        }
    }

    function startProgress() {
        if (progressInterval) clearInterval(progressInterval); // safe clear
        progressInterval = setInterval(() => {
            currentProgress++;
            if (currentProgress >= trackDuration) {
                currentProgress = 0;
                togglePlay();
            }
            updateProgressUI();
        }, 1000);
    }

    function stopProgress() {
        clearInterval(progressInterval);
    }

    function updateProgressUI() {
        const percent = (currentProgress / trackDuration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(currentProgress);
    }

    if (playBtn) playBtn.addEventListener('click', togglePlay);

    // Mix Selection Logic
    const mixCards = document.querySelectorAll('.mix-card');
    const playerTitle = document.getElementById('currentMixTitle');
    const playerImage = document.getElementById('playerArtwork');
    const tracklist = document.getElementById('tracklistContainer');

    const mixData = {
        '1': {
            title: 'Summer Sunset Sessions',
            image: 'assets/mix-cover-1.png',
            tracks: [
                { time: '00:00', name: 'Poolside - Harvest Moon' },
                { time: '04:32', name: 'Franc Moody - Dream In Colour' },
                { time: '08:45', name: 'Khruangbin - Time (You and I)' }
            ]
        },
        '2': {
            title: 'Golden Hour Dreams',
            image: 'assets/mix-cover-2.png',
            tracks: [
                { time: '00:00', name: 'Tycho - Epoch' },
                { time: '05:40', name: 'Bonobo - Kerala' },
                { time: '09:25', name: 'Lane 8 - Road' }
            ]
        },
        '3': {
            title: 'Mediterranean Escape',
            image: 'assets/mix-cover-3.png',
            tracks: [
                { time: '00:00', name: 'Folamour - Ivoire' },
                { time: '06:15', name: 'Parcels - Overnight' },
                { time: '11:00', name: 'Jungle - Keep Moving' }
            ]
        }
    };

    mixCards.forEach(card => {
        card.addEventListener('click', () => {
            const mixId = card.getAttribute('data-mix');
            const data = mixData[mixId];

            mixCards.forEach(c => c.style.opacity = '1');

            playerTitle.textContent = data.title;
            playerImage.src = data.image;

            if (isPlaying) togglePlay();
            currentProgress = 0;
            updateProgressUI();

            document.getElementById('latest').scrollIntoView({ behavior: 'smooth' });

            tracklist.innerHTML = '';
            data.tracks.forEach((track, index) => {
                const li = document.createElement('li');
                li.className = index === 0 ? 'track active' : 'track';
                li.innerHTML = `
                    <span class="track-time">${track.time}</span>
                    <span class="track-name">${track.name}</span>
                `;
                tracklist.appendChild(li);
            });

            for (let i = 0; i < 5; i++) {
                const li = document.createElement('li');
                li.className = 'track';
                li.innerHTML = `
                    <span class="track-time">--:--</span>
                    <span class="track-name">More awesome tracks...</span>
                `;
                tracklist.appendChild(li);
            }
        });
    });

    // Animate elements on scroll (Intersection Observer for other elements)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.mix-card, .photo-item').forEach(el => {
        // Initial state set in CSS? Use JS to force it if not
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
