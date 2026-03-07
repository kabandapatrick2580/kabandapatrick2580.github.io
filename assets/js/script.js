/* ==========================================================
   PORTFOLIO MAIN SCRIPT
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================
     CONFIG (EDIT THESE)
     ========================================================== */

  const EMAILJS_PUBLIC_KEY = "gmwrLP1CGr8WrlEwT";
  const SERVICE_ID = "service_ua012yy";
  const TEMPLATE_ID = "template_18pr9hb";

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
  const mobNavLinks = Array.from(document.querySelectorAll("#mobNav a"));

  hamBtn?.addEventListener("click", () => {
    mobNav.classList.toggle("open");
    hamBtn.setAttribute("aria-expanded", mobNav.classList.contains("open"));
  });

  window.closeMob = function () {
    if (!mobNav || !hamBtn) return;
    mobNav.classList.remove("open");
    hamBtn.setAttribute("aria-expanded", "false");
  };

  mobNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMob();
    });
  });

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
     WHATSAPP QR
     ========================================================== */

  const waQrCanvas = document.getElementById("waQrCanvas");
  const waQrLink = document.getElementById("waQrLink");

  if (waQrCanvas) {
    const waUrl = waQrCanvas.getAttribute("data-wa-url") || "https://wa.me/250780840983";

    if (waQrLink) {
      waQrLink.setAttribute("href", waUrl);
    }

    if (window.QRCode) {
      waQrCanvas.innerHTML = "";
      new QRCode(waQrCanvas, {
        text: waUrl,
        width: 148,
        height: 148,
        colorDark: "#0a6f66",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      waQrCanvas.innerHTML = "<p>QR unavailable. Use the WhatsApp link below.</p>";
    }
  }

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
