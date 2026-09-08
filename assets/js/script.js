'use strict';



// Theme (dark by default + user override)
const THEME_STORAGE_KEY = "theme";
const themeToggleBtn = document.querySelector("[data-theme-toggle]");

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (_) {
    return null;
  }
}

function setStoredTheme(value) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, value);
  } catch (_) { }
}

function resolveTheme() {
  const stored = getStoredTheme();
  if (!stored || stored === "system") return "dark";
  return stored;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;

  if (themeToggleBtn) {
    const icon = theme === "dark" ? "moon-outline" : "sunny-outline";
    const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    const ion = themeToggleBtn.querySelector("ion-icon");
    if (ion) ion.setAttribute("name", icon);
    themeToggleBtn.setAttribute("aria-label", label);
  }

  // Swap brand icons that are light-colored for dark mode (and reverse)
  document.querySelectorAll(".social-brand-icon[data-icon-dark][data-icon-light]").forEach(img => {
    const nextSrc = theme === "dark" ? img.dataset.iconDark : img.dataset.iconLight;
    if (nextSrc && img.getAttribute("src") !== nextSrc) {
      img.setAttribute("src", nextSrc);
    }
  });
}

applyTheme(resolveTheme());

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const current = resolveTheme();
    const next = current === "dark" ? "light" : "dark";
    setStoredTheme(next);
    applyTheme(next);
  });
}



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();

    if (selectValue) {
      selectValue.textContent = this.textContent;
    }

    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav links
navigationLinks.forEach(link => {
  link.addEventListener("click", function () {
    const targetPage = this.getAttribute("data-target");

    pages.forEach(page => {
      page.classList.toggle("active", page.dataset.page === targetPage);
    });

    navigationLinks.forEach(nav => {
      nav.classList.toggle("active", nav.getAttribute("data-target") === targetPage);
    });

    window.scrollTo(0, 0);
  });
});



function updateNavLabels() {
  const isMobile = window.innerWidth <= 767;
  navigationLinks.forEach(link => {
    const full = link.getAttribute("data-target");
    const short = link.getAttribute("data-label") || full;
    link.textContent = isMobile ? short : full.charAt(0).toUpperCase() + full.slice(1);
  });
}

updateNavLabels();
window.addEventListener("resize", updateNavLabels);
window.addEventListener("load", updateNavLabels);



document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop the default redirection
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        form.reset();
        status.style.display = "block";
        status.style.color = "green";
        status.textContent = "✅ Message sent successfully!";
      } else {
        status.style.display = "block";
        status.style.color = "red";
        status.textContent = "❌ Something went wrong. Try again!";
      }
    } catch (error) {
      status.style.display = "block";
      status.style.color = "red";
      status.textContent = "❌ Network error. Please try again.";
    }
  });
});


Fancybox.bind("[data-fancybox]", {
  //
  preloader: false,
  // Custom preloader function
  on: {
    init: (fancybox) => {
      const preloader = document.querySelector(".fancybox__preloader");
      if (preloader) {
        preloader.style.display = "none"; // Hide the preloader
      }
    },
  },
})
