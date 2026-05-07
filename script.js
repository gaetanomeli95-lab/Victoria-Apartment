const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const reviewCards = document.querySelectorAll('.review-card');
const sliderButtons = document.querySelectorAll('.slider-controls button');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox img');
const lightboxClose = document.querySelector('.lightbox-close');
const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = body.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    body.classList.remove('menu-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

let activeSlide = 0;
let sliderTimer;

function showSlide(index) {
  activeSlide = index;
  reviewCards.forEach((card, cardIndex) => {
    card.classList.toggle('active', cardIndex === index);
  });
  sliderButtons.forEach((button, buttonIndex) => {
    button.classList.toggle('active', buttonIndex === index);
  });
}

function startSlider() {
  if (!reviewCards.length) {
    return;
  }

  window.clearInterval(sliderTimer);
  sliderTimer = window.setInterval(() => {
    showSlide((activeSlide + 1) % reviewCards.length);
  }, 5200);
}

sliderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showSlide(Number(button.dataset.slide));
    startSlider();
  });
});

startSlider();

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const fullImage = item.dataset.full;
    const image = item.querySelector('img');

    if (!fullImage || !lightbox || !lightboxImage) {
      return;
    }

    lightboxImage.src = fullImage;
    lightboxImage.alt = image?.alt || 'Foto di Victoria Apartment Palermo';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    body.classList.add('lightbox-open');
  });
});

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  body.classList.remove('lightbox-open');
}

lightboxClose?.addEventListener('click', closeLightbox);

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
    body.classList.remove('menu-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.14
});

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});
