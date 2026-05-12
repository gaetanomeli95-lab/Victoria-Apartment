const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const reviewCards = document.querySelectorAll('.review-card');
const sliderButtons = document.querySelectorAll('.slider-controls button');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox img');
const lightboxClose = document.querySelector('.lightbox-close');
const galleryGrid = document.querySelector('[data-gallery-grid]');
const galleryToggle = document.querySelector('[data-gallery-toggle]');
const year = document.querySelector('#year');

async function blendLogoImages() {
  const images = Array.from(document.querySelectorAll('img.logo-blend'));

  if (!images.length) {
    return;
  }

  const threshold = 244;
  const softThreshold = 220;

  await Promise.all(images.map((img) => new Promise((resolve) => {
    if (img.complete && img.naturalWidth) {
      resolve();
      return;
    }

    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  })));

  images.forEach((img) => {
    try {
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      if (!w || !h) {
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a === 0) {
          continue;
        }

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const chroma = max - min;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        const isBackgroundWhite = luma >= threshold && chroma <= 10;
        if (isBackgroundWhite) {
          data[i + 3] = 0;
          continue;
        }

        const isSoftBackground = luma >= softThreshold && chroma <= 18;
        if (isSoftBackground) {
          const t = Math.min(1, Math.max(0, (luma - softThreshold) / (threshold - softThreshold)));
          data[i + 3] = Math.round(a * (1 - t));
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      img.src = dataUrl;
    } catch {
      // ignore (tainted canvas or unsupported)
    }
  });
}

function openDetailsForHash(hash) {
  if (!hash) {
    return;
  }

  const id = hash.replace('#', '');
  const target = document.getElementById(id);
  const details = target?.closest('details.page-details');

  if (details) {
    details.open = true;
  }
}

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
    openDetailsForHash(link.getAttribute('href') || '');
  });
});

openDetailsForHash(window.location.hash);

window.addEventListener('hashchange', () => {
  openDetailsForHash(window.location.hash);
});

blendLogoImages();

if (galleryGrid && galleryToggle) {
  const extraItems = Array.from(galleryGrid.querySelectorAll('.gallery-item:nth-child(n + 5)'));

  const syncGalleryItemsVisibility = (collapsed) => {
    extraItems.forEach((item) => {
      item.hidden = collapsed;
      item.style.display = collapsed ? 'none' : '';
    });
  };

  galleryGrid.classList.add('is-collapsed');
  galleryToggle.setAttribute('aria-expanded', 'false');
  syncGalleryItemsVisibility(true);

  galleryToggle.addEventListener('click', () => {
    const isCollapsed = galleryGrid.classList.toggle('is-collapsed');
    const isExpanded = !isCollapsed;

    syncGalleryItemsVisibility(isCollapsed);

    galleryToggle.setAttribute('aria-expanded', String(isExpanded));
    const label = galleryToggle.querySelector('span:last-child');
    const icon = galleryToggle.querySelector('span:first-child');

    if (label) {
      label.textContent = isExpanded ? 'Meno foto' : 'Altre foto';
    }

    if (icon) {
      icon.textContent = isExpanded ? '−' : '+';
    }

    if (isExpanded) {
      const firstExtraPhoto = galleryGrid.querySelector('.gallery-item:nth-child(5)');
      firstExtraPhoto?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

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
