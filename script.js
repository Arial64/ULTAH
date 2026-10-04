const audioLagu1 = document.getElementById('lagu1');
const envelope = document.getElementById('envelope');
const page2 = document.getElementById('page2');

audioLagu1.muted = false;
audioLagu1.volume = 1;

function startMusic() {
    audioLagu1.muted = false;
    audioLagu1.volume = 1;
    audioLagu1.play().catch(() => {
        document.addEventListener('click', startMusic, { once: true });
    });
}

window.addEventListener('load', startMusic);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        startMusic();
    }
});

if (envelope && page2) {
    envelope.addEventListener('click', () => {
        envelope.classList.add('hidden');
        page2.classList.remove('hidden');
        startMusic();
    });
}

