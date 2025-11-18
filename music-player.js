// Persistent background music across pages
let bgMusic;
let isMusicPlaying = false;

// Initialize music on page load
function initMusic() {
    if (!bgMusic) {
        bgMusic = document.getElementById('bgMusic');
        bgMusic.volume = 0.3;

        // Restore last playback time
        const musicTime = localStorage.getItem('musicTime');
        if (musicTime) {
            bgMusic.currentTime = parseFloat(musicTime);
        }

        // Try autoplay
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            updateMusicButton();
            localStorage.setItem('musicPlaying', 'true');
        }).catch(err => {
            console.log('Autoplay blocked, starting muted:', err);
            // Start muted to bypass autoplay restrictions
            bgMusic.muted = true;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                updateMusicButton();
                localStorage.setItem('musicPlaying', 'true');
            }).catch(err2 => console.log('Muted autoplay failed:', err2));
        });

        // Unmute on first user interaction
        document.addEventListener('click', () => {
            if (bgMusic.muted) {
                bgMusic.muted = false;
            }
        }, { once: true });

        // Save current time periodically
        setInterval(() => {
            if (isMusicPlaying) {
                localStorage.setItem('musicTime', bgMusic.currentTime);
            }
        }, 1000);
    }
}

// Toggle music on/off
function toggleMusic() {
    if (!bgMusic) return;

    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            localStorage.setItem('musicPlaying', 'true');
            updateMusicButton();
        }).catch(err => console.log('Play failed:', err));
    } else {
        bgMusic.pause();
        isMusicPlaying = false;
        localStorage.setItem('musicPlaying', 'false');
        updateMusicButton();
    }
}

// Update button appearance
function updateMusicButton() {
    const button = document.getElementById('musicToggle');
    if (button) {
        if (isMusicPlaying) {
            button.textContent = '🔇 MUSIC OFF';
            button.classList.add('playing');
        } else {
            button.textContent = '🔊 MUSIC ON';
            button.classList.remove('playing');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMusic();
    updateMusicButton();
});
