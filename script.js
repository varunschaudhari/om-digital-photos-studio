const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const slides = Array.from(document.querySelectorAll(".testimonial-slide"));
const sliderDots = document.getElementById("sliderDots");
const testimonialPrev = document.getElementById("testimonialPrev");
const testimonialNext = document.getElementById("testimonialNext");

const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const year = document.getElementById("year");

let lightboxIndex = 0;
let testimonialIndex = 0;
let testimonialTimer;

// Mobile menu
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Theme toggle with localStorage persistence
const savedTheme = localStorage.getItem("photo-portfolio-theme");
if (savedTheme === "light") {
  body.classList.add("light-theme");
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeToggle?.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  const isLight = body.classList.contains("light-theme");
  localStorage.setItem("photo-portfolio-theme", isLight ? "light" : "dark");
  themeToggle.innerHTML = isLight
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

// Gallery filtering
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach((item) => {
      const isMatch = filter === "all" || item.classList.contains(filter);
      item.classList.toggle("hidden", !isMatch);
    });
  });
});

const getVisibleGalleryItems = () =>
  galleryItems.filter((item) => !item.classList.contains("hidden"));

const renderLightboxSlide = (index) => {
  const visibleItems = getVisibleGalleryItems();
  if (!visibleItems.length) return;

  lightboxIndex = (index + visibleItems.length) % visibleItems.length;
  const currentItem = visibleItems[lightboxIndex];
  const image = currentItem.querySelector("img");

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxTitle.textContent = image.dataset.title || "";
  lightboxCategory.textContent = image.dataset.category || "";
};

const openLightbox = (item) => {
  const visibleItems = getVisibleGalleryItems();
  lightboxIndex = visibleItems.indexOf(item);
  renderLightboxSlide(lightboxIndex);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  body.style.overflow = "";
};

galleryItems.forEach((item) => {
  item.addEventListener("click", () => openLightbox(item));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => renderLightboxSlide(lightboxIndex - 1));
lightboxNext?.addEventListener("click", () => renderLightboxSlide(lightboxIndex + 1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox || !lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") renderLightboxSlide(lightboxIndex - 1);
  if (event.key === "ArrowRight") renderLightboxSlide(lightboxIndex + 1);
});

// Testimonials slider
const renderDots = () => {
  if (!sliderDots || !slides.length) return;
  sliderDots.innerHTML = "";
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `dot${index === testimonialIndex ? " active" : ""}`;
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
    dot.addEventListener("click", () => {
      showTestimonial(index);
      resetAutoplay();
    });
    sliderDots.appendChild(dot);
  });
};

const showTestimonial = (index) => {
  if (!slides.length) return;
  testimonialIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === testimonialIndex);
  });
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === testimonialIndex);
  });
};

const nextTestimonial = () => showTestimonial(testimonialIndex + 1);

const resetAutoplay = () => {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(nextTestimonial, 5000);
};

testimonialPrev?.addEventListener("click", () => {
  showTestimonial(testimonialIndex - 1);
  resetAutoplay();
});

testimonialNext?.addEventListener("click", () => {
  showTestimonial(testimonialIndex + 1);
  resetAutoplay();
});

if (slides.length) {
  renderDots();
  showTestimonial(0);
  resetAutoplay();
}

// Contact form validation feedback
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    formNote.textContent = "Please complete all required fields correctly.";
    formNote.style.color = "#da6969";
    return;
  }

  formNote.textContent = "Thank you. Your inquiry is ready to be sent.";
  formNote.style.color = "#68b46e";
  contactForm.reset();
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}
