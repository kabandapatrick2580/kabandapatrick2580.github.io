/* ==========================================================
   PROJECTS + CASE STUDIES
   ========================================================== */

let caseStudies = [];

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createIcon(path) {
  return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

const PROJECT_ICONS = {
  payments: createIcon("M3 7h18M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm1 9h4"),
  infra: createIcon("M4 6h16v4H4V6Zm0 8h16v4H4v-4Zm3-6v2m0 4v2m10-6v2m0 4v2"),
  education: createIcon("M3 9l9-5 9 5-9 5-9-5Zm3 2.5V16l6 3 6-3v-4.5"),
  civic: createIcon("M7 7h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3l-3 3v-3H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2"),
  platform: createIcon("M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v18"),
  default: createIcon("M8 8h8M8 12h8M8 16h5M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2")
};

function getProjectIconHTML(project) {
  const icon = String(project.icon || "").trim();
  const lcIcon = icon.toLowerCase();

  if (/\.(svg|png|jpg|jpeg|webp)$/.test(lcIcon)) {
    return `<img src="${escapeHTML(icon)}" alt="${escapeHTML(project.title)} icon" class="proj-icon">`;
  }

  const searchable = `${project.title || ""} ${(project.tech || []).join(" ")}`.toLowerCase();

  if (/quickbooks|payment|pay|irembo|urubuto/.test(searchable)) return PROJECT_ICONS.payments;
  if (/server|linux|smtp|imap|infrastructure|nginx|postfix|dovecot/.test(searchable)) return PROJECT_ICONS.infra;
  if (/learn|training|education/.test(searchable)) return PROJECT_ICONS.education;
  if (/ussd|civic|hackathon/.test(searchable)) return PROJECT_ICONS.civic;
  if (/goalifai|netpipo|platform|application|app/.test(searchable)) return PROJECT_ICONS.platform;

  return PROJECT_ICONS.default;
}

function i18nValue(path, fallback) {
  if (window.pkI18n && typeof window.pkI18n.get === "function") {
    return window.pkI18n.get(path, fallback);
  }

  return fallback;
}

async function loadProjects() {
  try {
    const language = window.pkI18n?.getLanguage?.() || "en";
    const response = await fetch(`/assets/data/case-studies.${language}.json`);
    if (!response.ok) {
      throw new Error("Failed to load projects.");
    }

    caseStudies = await response.json();

    const grid = document.getElementById("projectGrid");
    if (!grid) return;

    grid.innerHTML = "";

    caseStudies.forEach((project, index) => {
      const iconHTML = getProjectIconHTML(project);
      const tagsHTML = (project.tech || [])
        .slice(0, 5)
        .map(tag => `<span class="ptag">${escapeHTML(tag)}</span>`)
        .join("");

      const cardHTML = `
        <article class="proj-card sr" data-project="${index}" role="button" tabindex="0" aria-label="${escapeHTML(i18nValue("projects.cardAriaPrefix", "Open case study:"))} ${escapeHTML(project.title || "Project")}">
          <div class="proj-top">
            <div class="proj-ico">${iconHTML}</div>
            <span class="proj-link" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M8 16 16 8M10 8h6v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>

          <span class="proj-role">${escapeHTML(project.role || "")}</span>

          <div class="proj-meta">
            <span>${escapeHTML(project.timeline || i18nValue("projects.timelineFallback", "Timeline not listed"))}</span>
            <span>${escapeHTML(project.client || i18nValue("projects.clientFallback", "Client undisclosed"))}</span>
          </div>

          <h3 class="proj-title">${escapeHTML(project.title || "")}</h3>

          <p class="proj-desc">
            ${escapeHTML(project.solution || project.challenge || "")}
          </p>

          <div class="proj-tags">
            ${tagsHTML}
          </div>
        </article>
      `;

      grid.insertAdjacentHTML("beforeend", cardHTML);
    });

    initProjectCards();
  } catch (error) {
    console.error("Failed to load projects:", error);
  }
}

const modalOverlay = document.getElementById("projectModal");
const closeBtn = document.getElementById("closeModalBtn");

function openModal(index) {
  const caseStudy = caseStudies[index];
  if (!caseStudy) return;

  document.getElementById("modalRole").textContent = caseStudy.role || "";
  document.getElementById("modalTitle").textContent = caseStudy.title || "";
  document.getElementById("modalTimeline").textContent = caseStudy.timeline || "";
  document.getElementById("modalClient").textContent = caseStudy.client || "";
  document.getElementById("modalChallenge").textContent = caseStudy.challenge || "";
  document.getElementById("modalSolution").textContent = caseStudy.solution || "";
  document.getElementById("modalOutcome").textContent = caseStudy.outcome || "";

  const techContainer = document.getElementById("modalTech");
  techContainer.innerHTML = "";

  (caseStudy.tech || []).forEach(technology => {
    const span = document.createElement("span");
    span.textContent = technology;
    techContainer.appendChild(span);
  });

  const modalLink = document.getElementById("modalLink");
  if (modalLink && caseStudy.link) {
    modalLink.href = caseStudy.link;
    modalLink.style.display = "inline-block";
  } else if (modalLink) {
    modalLink.style.display = "none";
  }

  modalOverlay?.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay?.classList.remove("show");
  document.body.style.overflow = "";
}

closeBtn?.addEventListener("click", closeModal);

modalOverlay?.addEventListener("click", event => {
  if (event.target === modalOverlay) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modalOverlay?.classList.contains("show")) {
    closeModal();
  }
});

function initProjectCards() {
  const projectCards = document.querySelectorAll(".proj-card[data-project]");

  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      const idx = card.getAttribute("data-project");
      if (idx !== null) openModal(Number(idx));
    });

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const idx = card.getAttribute("data-project");
        if (idx !== null) openModal(Number(idx));
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", loadProjects);
document.addEventListener("pk:languagechange", loadProjects);
