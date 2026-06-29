/* =========================================================
   E-Portfolio — Muhammad Rizki Wardana, S.Pd.
   Interaksi: tema gelap/terang, navigasi, filter artefak,
   modal analisis, reveal on scroll, form kontak.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Theme toggle (light/dark) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const THEME_KEY = "eportfolio-theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      // Swap hero background image
      document.querySelectorAll(".hero__bg-image[data-dark]").forEach((img) => {
        img.src = img.getAttribute("data-dark");
      });
    } else {
      root.removeAttribute("data-theme");
      // Swap hero background image back to light
      document.querySelectorAll(".hero__bg-image[data-light]").forEach((img) => {
        img.src = img.getAttribute("data-light");
      });
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    applyTheme("dark");
  }

  themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll("#primary-nav a");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((section) => navObserver.observe(section));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Back to top visibility on scroll ---------- */
  const backToTopBtn = document.querySelector(".back-to-top-float");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("is-visible");
      } else {
        backToTopBtn.classList.remove("is-visible");
      }
    });
  }

  /* ---------- Artefak filters (siklus + jenis) ---------- */
  const filterGroups = document.querySelectorAll(".filter-group");
  const artefakCards = document.querySelectorAll(".artefak-card");
  const siklusGroups = document.querySelectorAll(".siklus-group");
  const artefakEmpty = document.getElementById("artefak-empty");
  const activeFilters = { siklus: "all", jenis: "all" };

  filterGroups.forEach((group) => {
    const key = group.getAttribute("data-filter-group");
    group.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        group.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        activeFilters[key] = chip.getAttribute("data-filter");
        applyFilters();
      });
    });
  });

  function applyFilters() {
    let visibleCount = 0;
    const currentSiklus = activeFilters.siklus;

    // Hide all siklus group headers first
    siklusGroups.forEach((group) => {
      group.style.display = "none";
    });

    // If "all" siklus is selected, show headers inline with cards
    if (currentSiklus === "all") {
      siklusGroups.forEach((group) => {
        group.style.display = "";
      });
    }

    artefakCards.forEach((card) => {
      const matchesSiklus = activeFilters.siklus === "all" || card.dataset.siklus === activeFilters.siklus;
      const matchesJenis = activeFilters.jenis === "all" || card.dataset.jenis === activeFilters.jenis;
      const visible = matchesSiklus && matchesJenis;
      card.classList.toggle("is-hidden", !visible);
      if (visible) visibleCount++;
    });
    artefakEmpty.hidden = visibleCount !== 0;
  }

  /* ---------- Analisis modal ---------- */
  const modalOverlay = document.getElementById("modal-overlay");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");
  const analisisCards = document.querySelectorAll(".analisis-card");

  function openModal(key) {
    const template = document.getElementById(`modal-${key}`);
    if (!template) return;
    modalBody.innerHTML = template.innerHTML;
    modalOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  analisisCards.forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.modal));
  });
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- Contact form (placeholder submit) ---------- */
  const kontakForm = document.getElementById("kontak-form");
  const formSuccess = document.getElementById("form-success");

  kontakForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formSuccess.hidden = false;
    kontakForm.reset();
    setTimeout(() => { formSuccess.hidden = true; }, 5000);
  });

  /* ---------- Artefak Drive links (data-drive placeholders) ---------- */
  document.querySelectorAll(".artefak-card__link").forEach((link) => {
    const placeholder = link.dataset.drive;
    if (placeholder) {
      link.setAttribute("title", `Placeholder: ${placeholder} — ganti href ini dengan tautan Google Drive Anda`);
    }
  });
})();
