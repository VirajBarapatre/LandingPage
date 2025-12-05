// main.js
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1. Smooth scroll for nav links
  // =========================
  const navLinks = document.querySelectorAll(
    '.navbar-nav .nav-link[href^="#"]'
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSelector = link.getAttribute("href");
      const target = document.querySelector(targetSelector);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Also used by hero button onclick="scrollToSection('#flow')"
  window.scrollToSection = function (selector) {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // =========================
  // 2. Back-to-top button
  // =========================
  const backToTopBtn = document.getElementById("backToTop");

  function updateBackToTop() {
    if (window.scrollY > 260) {
      backToTopBtn.style.display = "flex";
    } else {
      backToTopBtn.style.display = "none";
    }
  }

  updateBackToTop();
  window.addEventListener("scroll", updateBackToTop);

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // =========================
  // 3. Dynamic year in footer
  // =========================
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // =========================
  // 4. Reading progress bar
  // =========================
  const progressBar = document.createElement("div");
  const progressFill = document.createElement("div");

  progressBar.style.position = "fixed";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.width = "100%";
  progressBar.style.height = "4px";
  progressBar.style.background = "rgba(0,0,0,0.04)";
  progressBar.style.zIndex = "9999";

  progressFill.style.height = "100%";
  progressFill.style.width = "0";
  progressFill.style.background = "#176b3b"; // matches primary color
  progressFill.style.transition = "width 0.15s ease-out";

  progressBar.appendChild(progressFill);
  document.body.appendChild(progressBar);

  function updateProgressBar() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;

    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressFill.style.width = progress + "%";
  }

  updateProgressBar();
  window.addEventListener("scroll", updateProgressBar);
  window.addEventListener("resize", updateProgressBar);

  // =========================
  // 5. Scroll spy – highlight nav item for current section
  // =========================
  const sections = document.querySelectorAll("section[id]");
  const sectionIdToNavLink = {};

  navLinks.forEach((link) => {
    const href = link.getAttribute("href"); // e.g. "#about"
    if (href && href.startsWith("#")) {
      const id = href.slice(1); // "about"
      sectionIdToNavLink[id] = link;
    }
  });

  let activeId = null;

  function handleScrollSpy() {
    let bestId = null;
    let smallestOffset = Infinity;
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const rectTop = section.getBoundingClientRect().top + scrollY;
      const offset = Math.abs(rectTop - scrollY - 140); // 140px from top
      if (offset < smallestOffset) {
        smallestOffset = offset;
        bestId = section.id;
      }
    });

    if (bestId && bestId !== activeId) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const newActive = sectionIdToNavLink[bestId];
      if (newActive) newActive.classList.add("active");
      activeId = bestId;
    }
  }

  handleScrollSpy();
  window.addEventListener("scroll", handleScrollSpy);
  window.addEventListener("resize", handleScrollSpy);

  // =========================
  // 6. Keyboard shortcuts 1–9 → jump to sections
  // =========================
  const shortcutMap = [
    "#about",   // 1
    "#flow",    // 2
    "#court",   // 3
    "#skills",  // 4
    "#players", // 5
    "#physics", // 6
    "#glossary",// 7
    "#faq",     // 8
    "#start"    // 9
  ];

  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    const num = parseInt(e.key, 10);
    if (!isNaN(num) && num >= 1 && num <= shortcutMap.length) {
      const selector = shortcutMap[num - 1];
      const target = document.querySelector(selector);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});
