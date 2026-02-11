const body = document.body;
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");

const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxMeta = document.getElementById("lightboxMeta");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const testimonialSlides = Array.from(document.querySelectorAll(".testimonial-slide"));
const testimonialPrev = document.getElementById("testimonialPrev");
const testimonialNext = document.getElementById("testimonialNext");
const sliderDots = document.getElementById("sliderDots");

const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const yearEl = document.getElementById("year");
const eventDropdown = document.getElementById("eventDropdown");
const eventDropdownToggle = document.getElementById("eventDropdownToggle");
const eventDropdownMenu = document.getElementById("eventDropdownMenu");
const eventTypesInput = document.getElementById("eventTypesInput");
const selectedEvents = document.getElementById("selectedEvents");
const eventDropdownText = document.getElementById("eventDropdownText");

let lightboxIndex = 0;
let testimonialIndex = 0;
let testimonialTimer;

/* Mobile menu */
if (menuToggle && navLinks) {
  const closeMobileMenu = () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("menu-open", isOpen);
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.classList.contains("open")) return;
    const clickedInsideNav = navLinks.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);
    if (!clickedInsideNav && !clickedToggle) closeMobileMenu();
  });
}

/* Theme toggle */
const savedTheme = localStorage.getItem("om-theme");
if (savedTheme === "light") {
  body.classList.add("light-theme");
  if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeToggle?.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  const isLight = body.classList.contains("light-theme");
  localStorage.setItem("om-theme", isLight ? "light" : "dark");
  themeToggle.innerHTML = isLight
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

/* Portfolio filters */
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach((item) => {
      const shouldShow = selected === "all" || item.classList.contains(selected);
      item.classList.toggle("hidden", !shouldShow);
    });
  });
});

const visibleGalleryItems = () =>
  galleryItems.filter((item) => !item.classList.contains("hidden"));

const renderLightbox = (index) => {
  const items = visibleGalleryItems();
  if (!items.length || !lightboxImage) return;

  lightboxIndex = (index + items.length) % items.length;
  const current = items[lightboxIndex].querySelector("img");

  lightboxImage.src = current.src;
  lightboxImage.alt = current.alt;
  if (lightboxTitle) lightboxTitle.textContent = current.dataset.title || "";
  if (lightboxMeta) lightboxMeta.textContent = current.dataset.meta || "";
};

const openLightbox = (item) => {
  if (!lightbox) return;
  const items = visibleGalleryItems();
  lightboxIndex = items.indexOf(item);
  renderLightbox(lightboxIndex);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
};

const closeLightboxModal = () => {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  body.style.overflow = "";
};

galleryItems.forEach((item) => {
  item.addEventListener("click", () => openLightbox(item));
});

lightboxClose?.addEventListener("click", closeLightboxModal);
lightboxPrev?.addEventListener("click", () => renderLightbox(lightboxIndex - 1));
lightboxNext?.addEventListener("click", () => renderLightbox(lightboxIndex + 1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightboxModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navLinks?.classList.contains("open")) {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  }
  if (!lightbox || !lightbox.classList.contains("open")) return;
  if (event.key === "Escape") {
    closeLightboxModal();
    return;
  }
  if (event.key === "ArrowLeft") renderLightbox(lightboxIndex - 1);
  if (event.key === "ArrowRight") renderLightbox(lightboxIndex + 1);
});

/* Testimonials slider */
const renderTestimonial = (index) => {
  if (!testimonialSlides.length) return;
  testimonialIndex = (index + testimonialSlides.length) % testimonialSlides.length;
  testimonialSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === testimonialIndex);
  });
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === testimonialIndex);
  });
};

const initDots = () => {
  if (!sliderDots || !testimonialSlides.length) return;
  sliderDots.innerHTML = "";
  testimonialSlides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `dot${i === 0 ? " active" : ""}`;
    dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
    dot.addEventListener("click", () => {
      renderTestimonial(i);
      resetSliderTimer();
    });
    sliderDots.appendChild(dot);
  });
};

const resetSliderTimer = () => {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => {
    renderTestimonial(testimonialIndex + 1);
  }, 5000);
};

testimonialPrev?.addEventListener("click", () => {
  renderTestimonial(testimonialIndex - 1);
  resetSliderTimer();
});

testimonialNext?.addEventListener("click", () => {
  renderTestimonial(testimonialIndex + 1);
  resetSliderTimer();
});

if (testimonialSlides.length) {
  initDots();
  renderTestimonial(0);
  resetSliderTimer();
}

/* Contact form client-side hint */
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    if (formNote) {
      formNote.textContent = "Please complete all required fields correctly.";
      formNote.style.color = "#d96a6a";
    }
    return;
  }
  if (formNote) {
    formNote.textContent = "Thank you. Your inquiry is ready to send.";
    formNote.style.color = "#62b36b";
  }
  contactForm.reset();
});

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

/* Contact: professional multi-event dropdown */
if (
  eventDropdown &&
  eventDropdownToggle &&
  eventDropdownMenu &&
  eventTypesInput &&
  selectedEvents &&
  eventDropdownText
) {
  const checkboxes = Array.from(
    eventDropdownMenu.querySelectorAll('input[type="checkbox"]')
  );

  const renderSelectedEvents = () => {
    const selected = checkboxes
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    eventTypesInput.value = selected.join(", ");
    if (!selected.length) {
      eventDropdownText.textContent = "Select event type(s)";
      eventDropdownText.classList.add("is-placeholder");
    } else if (selected.length <= 2) {
      eventDropdownText.textContent = selected.join(", ");
      eventDropdownText.classList.remove("is-placeholder");
    } else {
      eventDropdownText.textContent = `${selected.length} events selected`;
      eventDropdownText.classList.remove("is-placeholder");
    }

    selectedEvents.innerHTML = selected
      .map((item) => `<span class="chip">${item}</span>`)
      .join("");
  };

  eventDropdownToggle.addEventListener("click", () => {
    const isOpen = eventDropdown.classList.toggle("open");
    eventDropdownToggle.setAttribute("aria-expanded", String(isOpen));
  });

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", renderSelectedEvents);
  });

  document.addEventListener("click", (event) => {
    if (!eventDropdown.classList.contains("open")) return;
    if (!eventDropdown.contains(event.target)) {
      eventDropdown.classList.remove("open");
      eventDropdownToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!eventDropdown.classList.contains("open")) return;
    eventDropdown.classList.remove("open");
    eventDropdownToggle.setAttribute("aria-expanded", "false");
  });

  contactForm?.addEventListener("reset", () => {
    checkboxes.forEach((cb) => {
      cb.checked = false;
    });
    renderSelectedEvents();
    eventDropdown.classList.remove("open");
    eventDropdownToggle.setAttribute("aria-expanded", "false");
  });

  renderSelectedEvents();
}

/* Fade-in on scroll via IntersectionObserver */
body.classList.add("js-loaded");
const revealTargets = document.querySelectorAll(
  "main section, .card, .recent-card, .gallery-item, .price-card, .testimonial-quote, .contact-form"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
);

revealTargets.forEach((el) => revealObserver.observe(el));
