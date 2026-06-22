/* ════════════════════════════════════
   main.js — Vasiliev Site 2026
════════════════════════════════════ */

/* ────────────────────────────────────
   SCROLL PROGRESS BAR
──────────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const total  = document.documentElement.scrollHeight - window.innerHeight;
  const pct    = total > 0 ? (window.scrollY / total) * 100 : 0;
  progressBar.style.width = pct + '%';
}

/* ────────────────────────────────────
   HEADER ON SCROLL
──────────────────────────────────── */
const header = document.getElementById('header');
function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 40);
}

/* ────────────────────────────────────
   CUSTOM CURSOR
──────────────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorDot  = cursor.querySelector('.cursor__dot');
const cursorRing = cursor.querySelector('.cursor__ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;
let rafId;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  cursorRing.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
  rafId = requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('mousedown', () => cursor.classList.add('cursor--click'));
document.addEventListener('mouseup',   () => cursor.classList.remove('cursor--click'));

document.querySelectorAll('a,button,.track-card,.h-gallery__item,.glass-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
});

/* ────────────────────────────────────
   MAGNETIC BUTTONS
──────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect  = el.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) * 0.28;
    const dy    = (e.clientY - cy) * 0.28;
    el.style.transform = `translate(${dx}px,${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ────────────────────────────────────
   PARALLAX ON SCROLL
──────────────────────────────────── */
const heroPx   = document.getElementById('hero-parallax');
const playerPx = document.getElementById('player-parallax');

function updateParallax() {
  const sy = window.scrollY;
  if (heroPx) {
    heroPx.style.transform = `translateY(${sy * 0.35}px)`;
  }
  if (playerPx) {
    const rect = playerPx.closest('.player-section').getBoundingClientRect();
    const rel  = -rect.top;
    playerPx.style.transform = `translateY(${rel * 0.2}px)`;
  }
}

/* ────────────────────────────────────
   SPLIT TEXT HERO ANIMATION
──────────────────────────────────── */
function splitText() {
  document.querySelectorAll('.hero__title-line').forEach((line, li) => {
    const text = line.textContent.trim();
    line.innerHTML = '';
    [...text].forEach((char, ci) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${0.05 + li * 0.3 + ci * 0.055}s`;
      line.appendChild(span);
    });
  });
}
splitText();

/* ────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
──────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-tl').forEach(el => {
  revealObserver.observe(el);
});

/* ────────────────────────────────────
   AUDIO PLAYER (30 Tracks Playlist)
──────────────────────────────────── */
const playlistEl   = document.getElementById('playlist');
const mainWaveform = document.getElementById('main-waveform');
const bottomWave   = document.getElementById('bottom-waveform');
const npTitle      = document.getElementById('np-title');
const npMeta       = document.getElementById('np-meta');
const npToggle     = document.getElementById('np-toggle');
const npArtImg     = document.getElementById('np-art-img');
const npPlaceholder= document.getElementById('np-placeholder');
const iconPlay     = npToggle?.querySelector('.icon-play');
const iconPause    = npToggle?.querySelector('.icon-pause');
const audioEl      = new Audio();

let currentTrackId = null;

// Generate Waveform Spans for both waveforms
function buildWaveform(el, count) {
  if (!el) return;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.style.setProperty('--h', (Math.random() * 22 + 8) + 'px');
    s.style.setProperty('--i', i);
    el.appendChild(s);
  }
}
buildWaveform(mainWaveform, 28);
buildWaveform(bottomWave, 20);

// Track artwork map (first 3 have real images)
const trackArt = {
  1: 'track1.png',
  2: 'track2.png',
  3: 'track3.png',
};

// Generate 30 Tracks (Mockup)
const trackNames = [
  "Песня о Новосибирске", "Крымские вечера", "Дорога в Бахчисарай", "Посвящение Высоцкому",
  "Кочкор-Ата — моя весна", "Сыновьям", "Сибирский мороз", "Мотив у рояля", "Памяти друзей",
  "Фестивальный аккорд", "Шансон над Обью", "Юность в Киргизии", "Ялтинский бриз", "Письмо из Симферополя",
  "Аккорды жизни", "Новосибирский вальс", "Путь музыканта", "Отец и мать", "Осенний Крым",
  "Песня для Николая", "Мелодия гор", "Сибирский характер", "Встреча в Бахчисарае", "Сквозь года",
  "Сцена и жизнь", "Шансон 2004", "Зимний романс", "Севастопольский прибой", "Песня о родине", "Финал пути"
];

const tracksData = trackNames.map((title, i) => ({
  id: i + 1,
  title,
  art: trackArt[i + 1] || null,
  duration: `0${Math.floor(Math.random() * 2) + 3}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  src: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 10) + 1}.mp3`
}));

// Render Playlist
if (playlistEl) {
  tracksData.forEach(track => {
    const num = String(track.id).padStart(2, '0');
    const item = document.createElement('div');
    const hasArt = !!track.art;
    item.className = hasArt ? 'pl-item pl-item--art' : 'pl-item';

    if (hasArt) {
      item.innerHTML = `
        <div class="pl-item__thumb"><img src="${track.art}" alt="${track.title}" loading="lazy"></div>
        <div class="pl-item__num">${num}</div>
        <div class="pl-item__body"><span class="pl-item__title">${track.title}</span></div>
        <div class="pl-item__playing"><span></span><span></span><span></span></div>
        <div class="pl-item__dur">${track.duration}</div>
      `;
    } else {
      item.innerHTML = `
        <div class="pl-item__num">${num}</div>
        <div class="pl-item__body"><span class="pl-item__title">${track.title}</span></div>
        <div class="pl-item__playing"><span></span><span></span><span></span></div>
        <div class="pl-item__dur">${track.duration}</div>
      `;
    }
    item.addEventListener('click', () => playTrack(track, item));
    playlistEl.appendChild(item);
  });
}

function playTrack(track, itemEl) {
  if (currentTrackId === track.id) {
    if (audioEl.paused) audioEl.play();
    else audioEl.pause();
    return;
  }

  // Deactivate previous
  document.querySelectorAll('.pl-item.active').forEach(el => el.classList.remove('active'));

  // Activate new
  currentTrackId = track.id;
  if (itemEl) itemEl.classList.add('active');
  audioEl.src = track.src;
  audioEl.play().catch(e => console.log('Audio play blocked:', e));

  // Update Now Playing info
  if (npTitle) npTitle.textContent = track.title;
  if (npMeta) npMeta.textContent = `Дискография · Васильев Николай`;

  // Update Now Playing artwork
  if (track.art && npArtImg && npPlaceholder) {
    npArtImg.src = track.art;
    npArtImg.style.display = 'block';
    npArtImg.style.objectFit = 'cover';
    npPlaceholder.style.display = 'none';
  } else if (npArtImg && npPlaceholder) {
    npArtImg.style.display = 'none';
    npPlaceholder.style.display = 'flex';
  }

  updatePlayState(true);
}

function updatePlayState(isPlaying) {
  document.querySelector('.player-ui')?.classList.toggle('is-playing', isPlaying);
  if (iconPlay)  iconPlay.style.display  = isPlaying ? 'none'  : 'block';
  if (iconPause) iconPause.style.display = isPlaying ? 'block' : 'none';
}

audioEl.addEventListener('play',  () => updatePlayState(true));
audioEl.addEventListener('pause', () => updatePlayState(false));
audioEl.addEventListener('ended', () => {
  updatePlayState(false);
  // Auto-next
  const nextIdx = tracksData.findIndex(t => t.id === currentTrackId) + 1;
  if (nextIdx < tracksData.length) {
    const nextTrack = tracksData[nextIdx];
    const nextItem  = playlistEl?.children[nextIdx];
    playTrack(nextTrack, nextItem);
    nextItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
});

npToggle?.addEventListener('click', () => {
  if (!currentTrackId && tracksData.length > 0) {
    playTrack(tracksData[0], playlistEl?.children[0]);
  } else {
    if (audioEl.paused) audioEl.play();
    else audioEl.pause();
  }
});

/* ────────────────────────────────────
   HORIZONTAL GALLERY DRAG SCROLL
──────────────────────────────────── */
const gallery = document.getElementById('h-gallery');
if (gallery) {
  let isDragging = false, startX, startScroll;

  gallery.addEventListener('mousedown', e => {
    isDragging  = true;
    startX      = e.pageX - gallery.offsetLeft;
    startScroll = gallery.scrollLeft;
    gallery.classList.add('grabbing');
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    gallery.classList.remove('grabbing');
  });
  gallery.addEventListener('mouseleave', () => {
    isDragging = false;
    gallery.classList.remove('grabbing');
  });
  gallery.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x    = e.pageX - gallery.offsetLeft;
    const walk = (x - startX) * 1.5;
    gallery.scrollLeft = startScroll - walk;
  });

  // Touch support
  let tStartX, tStartScroll;
  gallery.addEventListener('touchstart', e => {
    tStartX     = e.touches[0].pageX;
    tStartScroll = gallery.scrollLeft;
  }, { passive: true });
  gallery.addEventListener('touchmove', e => {
    const dx = tStartX - e.touches[0].pageX;
    gallery.scrollLeft = tStartScroll + dx;
  }, { passive: true });
}

/* ────────────────────────────────────
   MOBILE NAV TOGGLE
──────────────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const nav       = document.getElementById('nav');
navToggle?.addEventListener('click', () => {
  nav.classList.toggle('open');
  navToggle.classList.toggle('open');
});
// close on link click
nav?.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// close on click outside
document.addEventListener('click', e => {
  if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !navToggle.contains(e.target)) {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
  }
});

/* ────────────────────────────────────
   SMOOTH SCROLL FOR ANCHOR LINKS
──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});



/* ────────────────────────────────────
   FOOTER YEAR
──────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ────────────────────────────────────
   UNIFIED SCROLL LISTENER
──────────────────────────────────── */
function onScroll() {
  updateProgress();
  updateHeader();
  updateParallax();
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // initial call
