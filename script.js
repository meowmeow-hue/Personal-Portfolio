const body = document.body;
const header = document.getElementById("header");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const toast = document.getElementById("toast");

// Set current year automatically.
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile navigation.
navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Header border and active navigation while scrolling.
function updateNavigation() {
  header.classList.toggle("scrolled", window.scrollY > 20);

  let currentSection = "home";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) currentSection = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${currentSection}`,
    );
  });
}

window.addEventListener("scroll", updateNavigation);
updateNavigation();

// Dark/light theme with localStorage.
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
  themeToggle.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀" : "☾";
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
});

// Scroll reveal animation.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((item) => revealObserver.observe(item));

// Project filtering.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const selectedCategory = button.dataset.filter;
    projectCards.forEach((card) => {
      const shouldShow =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

// Front-end contact form validation.
function showError(input, message) {
  const formRow = input.closest(".form-row");
  formRow.classList.add("invalid");
  formRow.querySelector(".error-message").textContent = message;
}

function clearError(input) {
  const formRow = input.closest(".form-row");
  formRow.classList.remove("invalid");
  formRow.querySelector(".error-message").textContent = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  let isValid = true;

  [nameInput, emailInput, messageInput].forEach(clearError);

  if (nameInput.value.trim().length < 2) {
    showError(nameInput, "Please enter at least 2 characters.");
    isValid = false;
  }

  if (!isValidEmail(emailInput.value.trim())) {
    showError(emailInput, "Please enter a valid email address.");
    isValid = false;
  }

  if (messageInput.value.trim().length < 10) {
    showError(messageInput, "Please write at least 10 characters.");
    isValid = false;
  }

  if (isValid) {
    formStatus.textContent =
      "Message checked successfully. Connect this form to Formspree or EmailJS for real sending.";
    contactForm.reset();
  }
});
