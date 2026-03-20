/* ==========================================================
   EXPERIENCE
   ========================================================== */

function experienceLabel(path, fallback) {
  if (window.pkI18n && typeof window.pkI18n.get === "function") {
    return window.pkI18n.get(path, fallback);
  }

  return fallback;
}

async function loadExperience() {
  try {
    const language = window.pkI18n?.getLanguage?.() || "en";
    const response = await fetch(`/assets/data/experience.${language}.json`);
    if (!response.ok) {
      throw new Error("Failed to load experience.");
    }

    const data = await response.json();
    const root = document.getElementById("experience-root");
    if (!root) return;

    const headerHTML = `
      <div class="sr">
        <div class="slabel">${data.section.label}</div>
        <h2 class="stitle">${data.section.title_html || data.section.title}</h2>
        <p class="ssub">${data.section.subtitle}</p>
      </div>
      <div class="exp-tl"></div>
    `;

    root.innerHTML = headerHTML;
    const timeline = root.querySelector(".exp-tl");

    const escapeHTML = value =>
      String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const makeIcon = path =>
      `<svg viewBox="0 0 24 24" fill="none" class="exp-icon" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    const iconMap = {
      leadership: makeIcon("M12 3l2.3 4.7 5.2.8-3.8 3.7.9 5.3L12 15l-4.6 2.5.9-5.3-3.8-3.7 5.2-.8L12 3Zm0 12v6"),
      engineer: makeIcon("M7 7h10v10H7V7Zm-3 6h3m10 0h3M12 4v3m0 10v3"),
      operations: makeIcon("M4 6h16v4H4V6Zm0 8h16v4H4v-4Zm3-6v2m0 4v2m10-6v2m0 4v2"),
      default: makeIcon("M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm2 4h8M8 12h8M8 16h5")
    };

    const getRoleIcon = item => {
      const label = `${item.title || ""} ${item.company || ""}`.toLowerCase();
      if (/cto|lead|head|founding/.test(label)) return iconMap.leadership;
      if (/operations|it ops|administrator/.test(label)) return iconMap.operations;
      if (/engineer|developer|software|ingenieur|logiciel/.test(label)) return iconMap.engineer;
      return iconMap.default;
    };

    data.items.forEach(item => {
      const iconHTML = getRoleIcon(item);
      const employmentTypeHTML = item.employment_type
        ? `<span class="exp-type">${escapeHTML(item.employment_type)}</span>`
        : "";
      const proofButtonHTML = item.proof_url
        ? `<a class="exp-proof-btn" href="${escapeHTML(item.proof_url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(experienceLabel("experience.proofButton", "View Proof"))}</a>`
        : "";

      const itemHTML = `
        <div class="exp-item sr">
          <div class="exp-dot">${iconHTML}</div>
          <div class="exp-body">
            <div class="exp-header">
              <h3 class="exp-title">${escapeHTML(item.title)}</h3>
              <div class="exp-meta-right">
                <span class="exp-period">${escapeHTML(item.period)}</span>
                ${employmentTypeHTML}
              </div>
            </div>

            <div class="exp-company">${escapeHTML(item.company)}</div>
            <p class="exp-desc">${escapeHTML(item.description)}</p>
            <ul class="exp-list">
              ${(item.achievements || []).map(achievement => `<li>${escapeHTML(achievement)}</li>`).join("")}
            </ul>
            ${proofButtonHTML}
          </div>
        </div>
      `;

      timeline.insertAdjacentHTML("beforeend", itemHTML);
    });
  } catch (error) {
    console.error("Failed to load experience data:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadExperience);
document.addEventListener("pk:languagechange", loadExperience);
