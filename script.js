const audioLagu1 = document.getElementById('lagu1');
const envelope = document.getElementById('envelope');
const page2 = document.getElementById('page2');

const CLOUD_NAME = 'rxjvfmzy';
const UPLOAD_PRESET = 'hbd-kak';

const inputFoto = document.getElementById('inputFoto');
const tombolFoto = document.getElementById('tombolFoto');
const hasilFoto = document.getElementById('hasilFoto');
const statusFoto = document.getElementById('statusFoto');

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

function tampilkanFoto(src) {
    const img = document.createElement('img');
    img.alt = 'Foto kamu';
    img.src = src;
    hasilFoto.innerHTML = '';
    hasilFoto.appendChild(img);
    tombolFoto.textContent = 'Ganti Foto';
}

if (inputFoto && tombolFoto && hasilFoto) {
    try {
        const tersimpan = localStorage.getItem('fotoUrl');
        if (tersimpan) tampilkanFoto(tersimpan);
    } catch (e) {}

    tombolFoto.addEventListener('click', () => inputFoto.click());

    inputFoto.addEventListener('change', async () => {
        const file = inputFoto.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        if (file.size > 10 * 1024 * 1024) {
            statusFoto.textContent = 'Fotonya terlalu besar (maks 10 MB).';
            return;
        }

        tampilkanFoto(URL.createObjectURL(file));
        statusFoto.textContent = 'Mengirim foto...';
        tombolFoto.disabled = true;

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );
            if (!res.ok) throw new Error('Upload gagal');

            const data = await res.json();
            tampilkanFoto(data.secure_url);
            statusFoto.textContent = 'Foto berhasil terkirim 💌';
            try { localStorage.setItem('fotoUrl', data.secure_url); } catch (e) {}
        } catch (err) {
            statusFoto.textContent = 'Gagal mengirim foto, coba lagi ya.';
        } finally {
            tombolFoto.disabled = false;
            inputFoto.value = '';
        }
    });
}