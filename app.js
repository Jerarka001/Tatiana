/* ============================================================
   TATILINDA — Lógica de la aplicación
   ============================================================ */

// ---- CONFIGURACIÓN ----
const POSITIVE_ANSWERS = ['si', 'sí', 'yes', 'claro', 'obvio', 'mucho', 'siempre', 'demasiado', 'sip', 'se', 'por supuesto'];

const TITLES = [
  'Eres mi persona favorita en el universo',
  'Cada día a tu lado es un regalo',
  'Tu sonrisa ilumina hasta mi alma',
  'No hay nada más bonito que tu amor',
  'Contigo el tiempo se detiene',
  'Eres la mejor parte de mi historia',
];

const PHRASES = [
  'Solo quiero verte feliz.',
  'Contigo todo es mejor.',
  'Eres mi lugar seguro.',
  'Gracias por existir.',
  'Te elijo cada día.',
  'Nada me hace más bien que tú.',
];

const PHOTOS = [
  { src: '/fotos/IMG_0372.jpeg', quote: 'Eres el sueño que no sabía que tenía.' },
  { src: '/fotos/IMG_0959.jpeg', quote: 'Tu amor es mi lugar favorito.' },
  { src: '/fotos/IMG_2195.jpeg', quote: 'En tus ojos encontré mi hogar.' },
  { src: '/fotos/IMG_2577.jpeg', quote: 'Cada latido es para ti.' },
  { src: '/fotos/IMG_2894.jpeg', quote: 'Contigo todo tiene sentido.' },
  { src: '/fotos/IMG_3648.jpeg', quote: 'Eres mi persona para siempre.' },
  { src: '/fotos/IMG_5209.jpeg', quote: 'Amar es verte y no mirar nada más.' },
  { src: '/fotos/4BBA57F8-46C4-4A76-A5F4-B865571CFB04.jpeg', quote: 'Tu sonrisa es mi canción favorita.' },
];

// ---- DOM REFS ----
const landing     = document.getElementById('landing');
const accessInput = document.getElementById('accessInput');
const accessBtn   = document.getElementById('accessBtn');
const accessError = document.getElementById('accessError');
const landingCard = document.querySelector('.landing-card');

const main            = document.getElementById('main');
const animatedTitle   = document.getElementById('animatedTitle');
const carouselTrack   = document.getElementById('carouselTrack');
const changingPhrase  = document.getElementById('changingPhrase');

// ---- LANDING: validación de acceso ----
function isPositive(answer) {
  return POSITIVE_ANSWERS.some(word => answer.includes(word));
}

function handleAccess() {
  const answer = accessInput.value.trim().toLowerCase();

  if (answer && isPositive(answer)) {
    accessError.classList.remove('visible');
    landing.classList.add('hidden');
    main.classList.add('visible');
    initMain();
  } else {
    accessError.classList.add('visible');
    landingCard.classList.remove('shake');
    void landingCard.offsetWidth;
    landingCard.classList.add('shake');
    accessInput.value = '';
    accessInput.focus();
  }
}

accessBtn.addEventListener('click', handleAccess);
accessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAccess();
});

// ---- MAIN: inicialización ----
function initMain() {
  buildCarousel();
  startTyping(TITLES, animatedTitle);
  startPhrases(PHRASES, changingPhrase);
}

// ---- CARRUSEL POLAROID ----
function buildCarousel() {
  carouselTrack.innerHTML = '';

  const allPhotos = [...PHOTOS, ...PHOTOS];

  allPhotos.forEach((photo) => {
    const el = document.createElement('div');
    el.className = 'polaroid';
    const rot = (Math.random() * 6 - 3).toFixed(1);
    el.style.setProperty('--rot', `${rot}deg`);

    el.innerHTML = `
      <img src="${photo.src}" alt="" loading="lazy" />
      <span class="quote">${photo.quote}</span>
    `;
    carouselTrack.appendChild(el);
  });

  startCarouselAutoScroll();
}

let carouselAnimFrame = null;
let carouselX = 0;

function startCarouselAutoScroll() {
  if (carouselAnimFrame) cancelAnimationFrame(carouselAnimFrame);

  const speed = 0.4;

  function step() {
    const track = carouselTrack;
    const wrapper = track.parentElement;
    if (!track.children.length) return;

    const gap = 24;
    const itemWidth = track.children[0].offsetWidth + gap;
    const halfIndex = PHOTOS.length;
    const resetAt = -(itemWidth * halfIndex);

    carouselX -= speed;

    if (carouselX <= resetAt) {
      carouselX += itemWidth * halfIndex;
    }

    track.style.transform = `translateX(${carouselX}px)`;
    carouselAnimFrame = requestAnimationFrame(step);
  }

  carouselAnimFrame = requestAnimationFrame(step);
}

// ---- TEXTO ANIMADO (efecto máquina de escribir) ----
function startTyping(titles, el) {
  let index = 0;

  function typeText(text, callback) {
    el.classList.add('typing');
    el.textContent = '';
    let i = 0;

    function addChar() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(addChar, 45);
      } else {
        el.classList.remove('typing');
        setTimeout(callback, 2500);
      }
    }
    addChar();
  }

  function loop() {
    typeText(titles[index % titles.length], () => {
      index++;
      loop();
    });
  }

  loop();
}

// ---- FRASES CAMBIANTES ----
function startPhrases(phrases, el) {
  let index = 0;

  function showNext() {
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = phrases[index % phrases.length];
      el.style.opacity = '1';
      index++;
    }, 400);
  }

  showNext();
  setInterval(showNext, 6000);
}

// ---- ENTRADA POR TECLADO (Enter en landing) ----
accessInput.focus();
