/* ==========================================================
   PORTFOLIO MAIN SCRIPT
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================
     CONFIG (EDIT THESE)
     ========================================================== */

  const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
  const SERVICE_ID = "YOUR_SERVICE_ID";
  const TEMPLATE_ID = "YOUR_TEMPLATE_ID";

  if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  /* ==========================================================
     THEME SYSTEM
     ========================================================== */

  const H = document.documentElement;
  const tBtn = document.getElementById("themeBtn");
  const iSun = document.getElementById("iSun");
  const iMoon = document.getElementById("iMoon");

  function setTheme(t) {
    H.setAttribute("data-theme", t);
    localStorage.setItem("pk-theme", t);

    if (iSun && iMoon) {
      iSun.style.display = t === "dark" ? "block" : "none";
      iMoon.style.display = t === "dark" ? "none" : "block";
    }
  }

  setTheme(localStorage.getItem("pk-theme") || "light");

  tBtn?.addEventListener("click", () => {
    setTheme(H.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  window.matchMedia("(prefers-color-scheme:dark)")
    .addEventListener("change", e => {
      if (!localStorage.getItem("pk-theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });

  /* ==========================================================
     MOBILE NAV
     ========================================================== */

  const hamBtn = document.getElementById("hamBtn");
  const mobNav = document.getElementById("mobNav");

  hamBtn?.addEventListener("click", () => {
    mobNav.classList.toggle("open");
    hamBtn.setAttribute("aria-expanded", mobNav.classList.contains("open"));
  });

  window.closeMob = function () {
    mobNav.classList.remove("open");
    hamBtn.setAttribute("aria-expanded", "false");
  };

  document.addEventListener("click", e => {
    if (
      hamBtn &&
      mobNav &&
      !hamBtn.contains(e.target) &&
      !mobNav.contains(e.target)
    ) {
      closeMob();
    }
  });

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ==========================================================
     SCROLL REVEAL
     ========================================================== */

  const srEls = Array.from(document.querySelectorAll(".sr"));

  if ("IntersectionObserver" in window && srEls.length) {

    const parentMap = new Map();
    srEls.forEach(el => {
      let p = el.parentElement;
      if (!parentMap.has(p)) parentMap.set(p, []);
      parentMap.get(p).push(el);
    });

    srEls.forEach(el => {
      let siblings = parentMap.get(el.parentElement);
      let idx = siblings.indexOf(el);
      el.style.animationDelay = idx * 0.08 + "s";
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-vis", "");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07 });

    srEls.forEach(el => observer.observe(el));
  }

  /* ==========================================================
     ACTIVE NAV
     ========================================================== */

  const navAs = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = Array.from(document.querySelectorAll("section[id]"));

  if ("IntersectionObserver" in window && sections.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let id = entry.target.id;
          navAs.forEach(a => {
            a.classList.toggle("act", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(s => obs.observe(s));
  }

  /* ==========================================================
     CONTACT FORM (EmailJS + reCAPTCHA v2)
     ========================================================== */

  const form = document.getElementById("cForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const btn = this.querySelector(".f-sub");

      if (typeof grecaptcha !== "undefined") {
        const captchaResponse = grecaptcha.getResponse();
        if (!captchaResponse) {
          alert("Please verify that you're not a robot.");
          return;
        }
      }

      btn.textContent = "Sending...";
      btn.disabled = true;

      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
        .then(() => {
          btn.textContent = "Message sent ✓";
          btn.style.background = "#4ade80";
          this.reset();

          if (typeof grecaptcha !== "undefined") {
            grecaptcha.reset();
          }
        })
        .catch(err => {
          btn.textContent = "Failed — try again";
          btn.style.background = "#f87171";
          console.error("EmailJS error:", err);
        })
        .finally(() => {
          setTimeout(() => {
            btn.textContent = "Send Message →";
            btn.style.background = "";
            btn.disabled = false;
          }, 4000);
        });
    });
  }
  /* ==========================================================
   CASE STUDIES — LOAD FROM JSON
   ========================================================== */

let caseStudies = [];

async function loadCaseStudies() {
  try {
    const response = await fetch("assets/data/case-studies.json");

    if (!response.ok) {
      throw new Error("Failed to load case studies");
    }

    caseStudies = await response.json();

    initProjectCards();

  } catch (err) {
    console.error("Case studies load error:", err);
  }
}

/* ==========================================================
   MODAL SYSTEM
   ========================================================== */

const modalOverlay = document.getElementById("projectModal");
const closeBtn = document.getElementById("closeModalBtn");

function openModal(index) {
  const cs = caseStudies[index];
  if (!cs) return;

  document.getElementById("modalRole").textContent = cs.role;
  document.getElementById("modalTitle").textContent = cs.title;
  document.getElementById("modalTimeline").textContent = cs.timeline;
  document.getElementById("modalClient").textContent = cs.client;
  document.getElementById("modalChallenge").textContent = cs.challenge;
  document.getElementById("modalSolution").textContent = cs.solution;
  document.getElementById("modalOutcome").textContent = cs.outcome;

  const techContainer = document.getElementById("modalTech");
  techContainer.innerHTML = "";

  cs.tech.forEach(t => {
    const span = document.createElement("span");
    span.textContent = t;
    techContainer.appendChild(span);
  });

  document.getElementById("modalLink").href = cs.link;

  modalOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

closeBtn?.addEventListener("click", closeModal);

modalOverlay?.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay?.classList.contains("show")) {
    closeModal();
  }
});

/* ==========================================================
   PROJECT CARD LISTENERS
   ========================================================== */

function initProjectCards() {
  const projectCards = document.querySelectorAll(".proj-card[data-project]");

  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      const idx = card.getAttribute("data-project");
      if (idx !== null) openModal(Number(idx));
    });
  });
}

/* ==========================================================
   START LOADING DATA
   ========================================================== */

loadCaseStudies();


});
