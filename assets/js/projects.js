/* ==========================================================
   GLOBAL STATE
   ========================================================== */

let caseStudies = [];

/* ==========================================================
   LOAD + RENDER PROJECTS
   ========================================================== */

async function loadProjects() {
  try {
    const response = await fetch("/assets/data/case-studies.json");
    caseStudies = await response.json();

    const grid = document.getElementById("projectGrid");
    if (!grid) return;

    grid.innerHTML = "";

    caseStudies.forEach((project, index) => {

      // ===== Icon logic (emoji or image path) =====
      const iconHTML =
        project.icon &&
        (project.icon.endsWith(".svg") ||
         project.icon.endsWith(".png") ||
         project.icon.endsWith(".jpg"))
          ? `<img src="${project.icon}" alt="${project.title} icon" class="proj-icon">`
          : (project.icon || "📁");

      // ===== Tech tags =====
      const tagsHTML = (project.tech || [])
        .map(tag => `<span class="ptag">${tag}</span>`)
        .join("");

      const cardHTML = `
        <article class="proj-card sr" data-project="${index}">
          
          <div class="proj-top">
            <div class="proj-ico">${iconHTML}</div>
            <span class="proj-link">↗</span>
          </div>

          <span class="proj-role">${project.role || ""}</span>

          <h3 class="proj-title">${project.title || ""}</h3>

          <p class="proj-desc">
            ${project.solution || project.challenge || ""}
          </p>

          <div class="proj-tags">
            ${tagsHTML}
          </div>

        </article>
      `;

      grid.insertAdjacentHTML("beforeend", cardHTML);
    });

    initProjectCards(); // attach modal listeners

  } catch (error) {
    console.error("Failed to load projects:", error);
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

  document.getElementById("modalRole").textContent = cs.role || "";
  document.getElementById("modalTitle").textContent = cs.title || "";
  document.getElementById("modalTimeline").textContent = cs.timeline || "";
  document.getElementById("modalClient").textContent = cs.client || "";
  document.getElementById("modalChallenge").textContent = cs.challenge || "";
  document.getElementById("modalSolution").textContent = cs.solution || "";
  document.getElementById("modalOutcome").textContent = cs.outcome || "";

  const techContainer = document.getElementById("modalTech");
  techContainer.innerHTML = "";

  (cs.tech || []).forEach(t => {
    const span = document.createElement("span");
    span.textContent = t;
    techContainer.appendChild(span);
  });

  const modalLink = document.getElementById("modalLink");
  if (modalLink && cs.link) {
    modalLink.href = cs.link;
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
   INIT
   ========================================================== */

document.addEventListener("DOMContentLoaded", loadProjects);
