async function loadExperience() {
  try {
    const response = await fetch("/assets/data/experience.json");
    const data = await response.json();

    const root = document.getElementById("experience-root");

    // ===== Section Header =====
    const headerHTML = `
      <div class="sr">
        <div class="slabel">${data.section.label}</div>
        <h2 class="stitle">
          ${data.section.title.replace(
            "led & built.",
            "<em style='font-style:italic'>led & built.</em>"
          )}
        </h2>
        <p class="ssub">${data.section.subtitle}</p>
      </div>
      <div class="exp-tl"></div>
    `;

    root.innerHTML = headerHTML;

    const timeline = root.querySelector(".exp-tl");

    const escapeHTML = (value) =>
      String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    // ===== Experience Items =====
    data.items.forEach(item => {
      const iconValue = String(item.icon || "");
      const hasImageIcon = /\.(svg|png|jpg|jpeg|webp)$/i.test(iconValue);
      const iconHTML = hasImageIcon
        ? `<img src="${escapeHTML(iconValue)}" alt="${escapeHTML(item.title)} icon" class="exp-icon" />`
        : `<svg viewBox="0 0 24 24" fill="none" class="exp-icon" aria-hidden="true"><path d="M4 6h16v4H4V6Zm0 8h16v4H4v-4Zm3-6v2m0 4v2m10-6v2m0 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

      const employmentTypeHTML = item.employment_type
        ? `<span class="exp-type">${escapeHTML(item.employment_type)}</span>`
        : "";

      const proofButtonHTML = item.proof_url
        ? `<a class="exp-proof-btn" href="${escapeHTML(item.proof_url)}" target="_blank" rel="noopener noreferrer">View Proof</a>`
        : "";

      const itemHTML = `
        <div class="exp-item sr">
            <div class="exp-dot">
            ${iconHTML}
            </div>

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
                ${(item.achievements || []).map(a => `<li>${escapeHTML(a)}</li>`).join("")}
            </ul>
            ${proofButtonHTML}
            </div>
        </div>
        `;

      timeline.insertAdjacentHTML("beforeend", itemHTML);
    });

  } catch (err) {
    console.error("Failed to load experience data:", err);
  }
}

// Load when DOM ready
document.addEventListener("DOMContentLoaded", loadExperience);
