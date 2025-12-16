// ==========================================
// MUSIC PLAYER - Reproductor de música lofi
// ==========================================

// Playlist de música lofi (usando YouTube embeds)
// Puedes personalizar esta lista con tus propios videos
const LOFI_PLAYLIST = [
    {
        id: 'jfKfPfyJRdk',
        title: 'Lofi Hip Hop Radio',
        artist: 'Lofi Girl'
    },
    {
        id: '4xDzrJKXOOY',
        title: 'Synthwave Radio',
        artist: 'Lofi Girl'
    },
    {
        id: 'lTRiuFIWV54',
        title: 'Jazz Lofi Radio',
        artist: 'Lofi Girl'
    }
];

class MusicPlayer {
    constructor() {
        this.isEnabled = false;
        this.volume = 30; // 0-100
        this.currentTrack = 0;
        this.player = null;
        this.playerReady = false;

        this.loadSettings();
        this.createPlayerUI();
    }

    loadSettings() {
        const settings = localStorage.getItem('musicSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.isEnabled = parsed.enabled || false;
            this.volume = parsed.volume || 30;
            this.currentTrack = parsed.track || 0;
        }
    }

    saveSettings() {
        localStorage.setItem('musicSettings', JSON.stringify({
            enabled: this.isEnabled,
            volume: this.volume,
            track: this.currentTrack
        }));
    }

    createPlayerUI() {
        // Crear controles del reproductor
        const playerHTML = `
            <div class="music-player pixel-border" id="musicPlayer">
                <div class="music-header">
                    <span class="music-title">🎵 Música Lofi</span>
                    <button class="pixel-btn tiny" id="musicToggle">
                        ${this.isEnabled ? '⏸' : '▶'}
                    </button>
                </div>
                <div class="music-controls ${this.isEnabled ? 'active' : ''}">
                    <div class="track-info">
                        <span id="currentTrack">${LOFI_PLAYLIST[this.currentTrack].title}</span>
                    </div>
                    <div class="volume-control">
                        <span>🔊</span>
                        <input type="range" id="volumeSlider" min="0" max="100" value="${this.volume}">
                        <span id="volumeValue">${this.volume}%</span>
                    </div>
                    <div class="track-selector">
                        ${LOFI_PLAYLIST.map((track, index) => `
                            <button class="pixel-btn tiny ${index === this.currentTrack ? 'active' : ''}"
                                    data-track="${index}">
                                ${index + 1}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div id="youtubePlayer" style="display: none;"></div>
            </div>
        `;

        // Insertar antes del achievement toast
        const toast = document.getElementById('achievementToast');
        if (toast) {
            toast.insertAdjacentHTML('beforebegin', playerHTML);
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('musicToggle');
        const volumeSlider = document.getElementById('volumeSlider');
        const trackButtons = document.querySelectorAll('.track-selector .pixel-btn');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleMusic());
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(parseInt(e.target.value));
            });
        }

        trackButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const trackIndex = parseInt(btn.dataset.track);
                this.changeTrack(trackIndex);
            });
        });
    }

    async toggleMusic() {
        this.isEnabled = !this.isEnabled;

        const toggleBtn = document.getElementById('musicToggle');
        const controls = document.querySelector('.music-controls');

        if (toggleBtn) {
            toggleBtn.textContent = this.isEnabled ? '⏸' : '▶';
        }

        if (controls) {
            controls.classList.toggle('active', this.isEnabled);
        }

        if (this.isEnabled) {
            await this.loadYouTubeAPI();
            this.playMusic();
        } else {
            this.stopMusic();
        }

        this.saveSettings();
    }

    loadYouTubeAPI() {
        return new Promise((resolve) => {
            // Si ya está cargada
            if (window.YT && window.YT.Player) {
                resolve();
                return;
            }

            // Si ya hay un script cargándose
            if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                window.onYouTubeIframeAPIReady = resolve;
                return;
            }

            // Cargar API de YouTube
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = resolve;
        });
    }

    playMusic() {
        const videoId = LOFI_PLAYLIST[this.currentTrack].id;

        if (!this.player) {
            this.player = new YT.Player('youtubePlayer', {
                height: '0',
                width: '0',
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    playsinline: 1
                },
                events: {
                    onReady: (event) => {
                        this.playerReady = true;
                        event.target.setVolume(this.volume);
                        event.target.playVideo();
                    },
                    onStateChange: (event) => {
                        // Si el video termina, reproducir el siguiente
                        if (event.data === YT.PlayerState.ENDED) {
                            this.nextTrack();
                        }
                    }
                }
            });
        } else if (this.playerReady) {
            this.player.loadVideoById(videoId);
            this.player.setVolume(this.volume);
            this.player.playVideo();
        }
    }

    stopMusic() {
        if (this.player && this.playerReady) {
            this.player.pauseVideo();
        }
    }

    setVolume(volume) {
        this.volume = volume;

        const volumeValue = document.getElementById('volumeValue');
        if (volumeValue) {
            volumeValue.textContent = `${volume}%`;
        }

        if (this.player && this.playerReady) {
            this.player.setVolume(volume);
        }

        this.saveSettings();
    }

    changeTrack(trackIndex) {
        if (trackIndex < 0 || trackIndex >= LOFI_PLAYLIST.length) return;

        this.currentTrack = trackIndex;

        // Actualizar UI
        const trackInfo = document.getElementById('currentTrack');
        if (trackInfo) {
            trackInfo.textContent = LOFI_PLAYLIST[trackIndex].title;
        }

        // Actualizar botones
        const trackButtons = document.querySelectorAll('.track-selector .pixel-btn');
        trackButtons.forEach((btn, index) => {
            btn.classList.toggle('active', index === trackIndex);
        });

        // Reproducir nueva pista
        if (this.isEnabled && this.player && this.playerReady) {
            this.player.loadVideoById(LOFI_PLAYLIST[trackIndex].id);
            this.player.playVideo();
        }

        this.saveSettings();
    }

    nextTrack() {
        const nextIndex = (this.currentTrack + 1) % LOFI_PLAYLIST.length;
        this.changeTrack(nextIndex);
    }

    prevTrack() {
        const prevIndex = (this.currentTrack - 1 + LOFI_PLAYLIST.length) % LOFI_PLAYLIST.length;
        this.changeTrack(prevIndex);
    }
}

// Inicializar reproductor al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});
