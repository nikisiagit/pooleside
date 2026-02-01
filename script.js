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

    // --- INTRO & LOGO SCROLL ANIMATION ---
    const floatingLogo = document.getElementById('floatingLogo');
    const introText = document.querySelector('.intro-text-container');
    const navLogo = document.querySelector('.logo'); // The real nav logo container
    const header = document.querySelector('.header');

    // Config
    const spacerHeight = window.innerHeight * 2.5; // Matches 250vh in CSS
    const introEndScroll = window.innerHeight * 1.5; // Animation ends after 1.5 viewport heights

    // Initial State functions
    function updateScrollAnimation() {
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / introEndScroll, 1);

        // 1. Text Opacity (Fade out quickly)
        if (introText) {
            introText.style.opacity = Math.max(1 - progress * 2, 0);
            introText.style.transform = `translateY(-${progress * 50}px)`;
        }

        // 2. Logo Animation
        // Start: Bottom center (set in CSS: bottom: 0, left: 50%, translate(-50%, 40%))
        // Middle (at progress 0.5): Center screen (top: 50%, left: 50%, translate(-50%, -50%))
        // End (at progress 1.0): Top Left (Top: 20px, Left: 20px, scale: 0.3)
        // We need to calculate precise pixels for smooth transition

        const startBottom = 0; // px from bottom
        const startScale = 1;

        // Target Nav Position (approximate, hardcoded for now or measured)
        const endTop = 15; // px from top
        const endLeft = 20; // px from left
        const endScale = 40 / 300; // nav logo height (40) / original logo width (approx 300) -> approx 0.13
        // Actually, we can just visually tune this scale
        const finalScale = 0.4;

        if (progress < 0.5) {
            // Phase 1: Rise from bottom to center
            const phaseProgress = progress / 0.5; // 0 to 1

            // Interpolate position
            // Start: translate(-50%, 40%) -> which is y = +40% of height. 
            // Target: translate(-50%, -50%) -> Center

            // We'll use fixed positioning 'top' instead of bottom for easier math
            const viewportH = window.innerHeight;
            const logoH = floatingLogo.offsetHeight || 100;

            // Start Y: viewportH - logoH * 0.6 (since 40% is hidden down)
            // Center Y: viewportH / 2 - logoH / 2

            // Simpler approach with percentages in transform
            // Y Start: 40vh (relative to center? no).
            // Let's stick to the transform: translate(-50%, Y%)
            // Start Y%: 40
            // End Y%: -50 (Center)

            const currentY = 40 - (phaseProgress * 90); // 40 -> -50

            floatingLogo.style.transform = `translate(-50%, ${currentY}%) scale(1)`;
            floatingLogo.style.top = 'auto';
            floatingLogo.style.bottom = '0';
            floatingLogo.style.left = '50%';

            // Keep nav logo hidden
            navLogo.style.opacity = '0';

        } else {
            // Phase 2: Center to Top-Left Nav
            const phaseProgress = (progress - 0.5) / 0.5; // 0 to 1

            // From Center to Nav
            // Center: Top 50%, Left 50%, Translate -50%, -50%
            // Nav: Top ~20px, Left ~20px, Translate 0, 0

            // Standardize to pixels for Phase 2
            const startTop = window.innerHeight / 2;
            const startLeft = window.innerWidth / 2;

            const currentTop = startTop - (phaseProgress * (startTop - endTop)); // Moves to 20px
            const currentLeft = startLeft - (phaseProgress * (startLeft - endLeft)); // Moves to 20px

            // Transform interpolation
            // Start: -50%, -50%
            // End: 0%, 0%
            const trans = -50 + (phaseProgress * 50);

            // Scale interpolation
            const currentScale = 1 - (phaseProgress * (1 - finalScale));

            floatingLogo.style.top = `${currentTop}px`;
            floatingLogo.style.left = `${currentLeft}px`;
            floatingLogo.style.bottom = 'auto';
            floatingLogo.style.transform = `translate(${trans}%, ${trans}%) scale(${currentScale})`;

            // Specific check for end
            if (progress >= 0.95) {
                navLogo.style.opacity = '1';
                floatingLogo.style.opacity = '0'; // Hide fake logo

                // Show Header Background
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.webkitBackdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.05)';
            } else {
                navLogo.style.opacity = '0';
                floatingLogo.style.opacity = '1';

                // Hide Header Background
                header.style.backgroundColor = 'transparent';
                header.style.backdropFilter = 'none';
                header.style.webkitBackdropFilter = 'none';
                header.style.boxShadow = 'none';
            }
        }
    }

    window.addEventListener('scroll', () => requestAnimationFrame(updateScrollAnimation));
    updateScrollAnimation(); // Initial call

    // --- END INTRO ANIMATION CODE ---

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
