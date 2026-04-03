/* ==========================================================
   PORTFOLIO MAIN SCRIPT
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const EMAILJS_PUBLIC_KEY = "gmwrLP1CGr8WrlEwT";
  const BREVO_LEAD_FORM_URL = "https://33c75bbe.sibforms.com/serve/MUIFALR1jgynagnyxw8t14gS81Nt4h1U4mDbulaQI1wyvjxCWgDBDMDwF5XqH5plYzvcYgfO_En8t84WVmOM8qv9l-uRqJgJKJrXTr5XkNi0OVxtj0ype-mgx-eZpGfUM211bhWjvsnwwdwy556kY0jc5HUzYOyweqgNbOJFc4I_KjVkn88hrmlYueE_39wY0-699WUzHPjcdQOL2A==";
  const I18N_BASE_URL = "/assets/data/i18n";
  const LOCALE_STORAGE_KEY = "pk-lang";
  const DEFAULT_LANGUAGE = "en";
  const SUPPORTED_LANGUAGES = ["en", "fr"];

  if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  const H = document.documentElement;
  const tBtn = document.getElementById("themeBtn");
  const iSun = document.getElementById("iSun");
  const iMoon = document.getElementById("iMoon");
  const hamBtn = document.getElementById("hamBtn");
  const mobNav = document.getElementById("mobNav");
  const mobNavLinks = Array.from(document.querySelectorAll("#mobNav a"));
  const langSelect = document.getElementById("langSelect");
  const yearEl = document.getElementById("year");

  const leadForm = document.getElementById("leadForm");
  const leadStatus = document.getElementById("leadStatus");
  const leadSubmitBtn = document.getElementById("leadSubmitBtn");
  const resourceList = document.getElementById("resourceList");
  const leadResourceId = document.getElementById("leadResourceId");
  const leadResourceTitle = document.getElementById("leadResourceTitle");
  const selectedResourceLabel = document.getElementById("selectedResourceLabel");
  const waQrCanvas = document.getElementById("waQrCanvas");
  const waQrLink = document.getElementById("waQrLink");

  let localeData = {};
  let currentLanguage = DEFAULT_LANGUAGE;
  let leadResources = [];
  let selectedResource = null;

  function getNestedValue(source, path, fallback) {
    const value = String(path || "")
      .split(".")
      .filter(Boolean)
      .reduce((acc, part) => {
        if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
          return acc[part];
        }
        return undefined;
      }, source);

    return value === undefined ? fallback : value;
  }

  function t(path, fallback = "") {
    return getNestedValue(localeData, path, fallback);
  }

  window.pkI18n = {
    getLanguage: () => currentLanguage,
    get: (path, fallback = "") => getNestedValue(localeData, path, fallback),
    t,
    setLanguage
  };

  function normalizeLanguage(language) {
    return SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
  }

  function setTheme(theme) {
    H.setAttribute("data-theme", theme);
    localStorage.setItem("pk-theme", theme);

    if (iSun && iMoon) {
      iSun.style.display = theme === "dark" ? "block" : "none";
      iMoon.style.display = theme === "dark" ? "none" : "block";
    }
  }

  function setText(selector, value, root = document) {
    const el = root.querySelector(selector);
    if (el && value !== undefined) {
      el.textContent = value;
    }
  }

  function setHTML(selector, value, root = document) {
    const el = root.querySelector(selector);
    if (el && value !== undefined) {
      el.innerHTML = value;
    }
  }

  function setPlaceholder(selector, value, root = document) {
    const el = root.querySelector(selector);
    if (el && value !== undefined) {
      el.setAttribute("placeholder", value);
    }
  }

  function setAttribute(selector, attribute, value, root = document) {
    const el = root.querySelector(selector);
    if (el && value !== undefined) {
      el.setAttribute(attribute, value);
    }
  }

  async function fetchLocale(language) {
    const response = await fetch(`${I18N_BASE_URL}/${language}.json`);

    if (!response.ok) {
      throw new Error(`Failed to load locale ${language}`);
    }

    return response.json();
  }

  function applyNavTranslations() {
    const navLinks = t("nav.links", []);
    const desktopLinks = document.querySelectorAll(".nav-links a");
    const mobileLinks = document.querySelectorAll("#mobNav a");

    navLinks.forEach((label, index) => {
      if (desktopLinks[index]) desktopLinks[index].textContent = label;
      if (mobileLinks[index]) mobileLinks[index].textContent = label;
    });

    setText(".nav-contact-btn", t("nav.cta"));
    setText(".nav-cv-btn", t("nav.cv"));
    setText(".mob-nav-cv", t("nav.cv"));
    setAttribute("#themeBtn", "aria-label", t("nav.themeToggleAria"));
    setAttribute("#hamBtn", "aria-label", t("nav.mobileToggleAria"));
    setAttribute("#langSelect", "aria-label", t("nav.languageAria"));
    setText(".lang-switch-label", t("nav.languageLabel"));
  }

  function applyHeroTranslations() {
    setText(".avail-pill-text", t("hero.availability"));
    setHTML(".hero-name", t("hero.nameHtml"));
    setHTML(".hero-sub1", t("hero.rolesHtml"));
    setText(".hero-sub2", t("hero.summary"));

    const heroTags = document.querySelectorAll(".hero-tag");
    t("hero.tags", []).forEach((label, index) => {
      if (heroTags[index]) heroTags[index].textContent = label;
    });

    const heroProof = document.querySelectorAll(".hero-proof .proof-item");
    t("hero.proof", []).forEach((label, index) => {
      if (heroProof[index]) heroProof[index].innerHTML = label;
    });

    setText(".hero-projects-label", t("hero.primaryCta"));
    setText(".hero-ctas .btn-s", t("hero.secondaryCta"));

    setAttribute(".pc-photo-inner img", "alt", t("hero.portraitAlt"));
    setText(".pc-avail-badge-text", t("profile.availabilityBadge"));
    setText(".pc-name", t("profile.name"));
    setText(".pc-role", t("profile.role"));

    const profileRows = document.querySelectorAll(".pc-row");
    const profileData = t("profile.rows", []);
    profileRows.forEach((row, index) => {
      const item = profileData[index];
      if (!item) return;
      setText(".pc-l", item.label, row);
      setText(".pc-v", item.value, row);
    });

    setText(".pc-foot-text", t("profile.location"));
  }

  function applyAboutTranslations() {
    setText("#about .slabel", t("about.label"));
    setHTML("#about .stitle", t("about.titleHtml"));

    const aboutParagraphs = document.querySelectorAll("#about .about-body p");
    t("about.body", []).forEach((copy, index) => {
      if (aboutParagraphs[index]) aboutParagraphs[index].textContent = copy;
    });

    const stats = document.querySelectorAll("#about .stat-card");
    t("about.stats", []).forEach((item, index) => {
      if (stats[index]) setText(".stat-d", item, stats[index]);
    });

    setText("#about .vals-block h3", t("about.principlesTitle"));
    const principleRows = document.querySelectorAll("#about .val-row");
    t("about.principles", []).forEach((item, index) => {
      if (!principleRows[index]) return;
      const textRoot = principleRows[index].querySelector(".val-text");
      if (!textRoot) return;
      setText("strong", item.title, textRoot);
      setText("span", item.text, textRoot);
    });
  }

  function applyServicesTranslations() {
    setText("#services .slabel", t("services.label"));
    setHTML("#services .stitle", t("services.titleHtml"));
    setText("#services .ssub", t("services.subtitle"));
    setText("#services .svc-intro", t("services.intro"));

    const cards = document.querySelectorAll("#services .svc-card");
    t("services.cards", []).forEach((item, index) => {
      const card = cards[index];
      if (!card) return;
      setText(".svc-title", item.title, card);
      setText(".svc-desc", item.description, card);
      const bullets = card.querySelectorAll(".svc-list li");
      (item.bullets || []).forEach((bullet, bulletIndex) => {
        if (bullets[bulletIndex]) bullets[bulletIndex].textContent = bullet;
      });
    });

    setText("#services .svc-close", t("services.cta.text"));
    setText("#services .svc-cta .btn-p", t("services.cta.button"));
  }

  function applyIdealClientTranslations() {
    setText("#ideal-clients .slabel", t("idealClients.label"));
    setHTML("#ideal-clients .stitle", t("idealClients.titleHtml"));
    setText("#ideal-clients .ssub", t("idealClients.subtitle"));
    setText("#ideal-clients .ideal-intro", t("idealClients.intro"));

    const cards = document.querySelectorAll("#ideal-clients .ideal-card");
    t("idealClients.cards", []).forEach((item, index) => {
      const card = cards[index];
      if (!card) return;
      setText(".ideal-title", item.title, card);
      setText(".ideal-desc", item.description, card);
      const bullets = card.querySelectorAll(".ideal-list li");
      (item.bullets || []).forEach((bullet, bulletIndex) => {
        if (bullets[bulletIndex]) bullets[bulletIndex].textContent = bullet;
      });
    });

    setText("#ideal-clients .ideal-close", t("idealClients.cta.text"));
    setText("#ideal-clients .ideal-cta .btn-p", t("idealClients.cta.button"));
  }

  function applyProjectSectionTranslations() {
    setText("#projects .slabel", t("projects.label"));
    setHTML("#projects .stitle", t("projects.titleHtml"));
    setText("#projects .ssub", t("projects.subtitle"));
  }

  function applyEducationTranslations() {
    setText("#education .slabel", t("education.label"));
    setHTML("#education .stitle", t("education.titleHtml"));
    setText("#education .ssub", t("education.subtitle"));

    const cards = document.querySelectorAll("#education .edu-card");
    t("education.items", []).forEach((item, index) => {
      const card = cards[index];
      if (!card) return;
      setText(".edu-badge", item.award, card);
      setText(".edu-period", item.period, card);
      setText(".edu-title", item.title, card);
      setText(".edu-school", item.institution, card);
      setText(".edu-desc", item.description, card);
    });
  }

  function applySkillsTranslations() {
    setText("#skills .slabel", t("skills.label"));
    setHTML("#skills .stitle", t("skills.titleHtml"));
    setText("#skills .ssub", t("skills.subtitle"));

    const categories = document.querySelectorAll("#skills .sk-cat");
    t("skills.categories", []).forEach((item, index) => {
      const category = categories[index];
      if (!category) return;
      setText(".sk-cat-lbl", item.label, category);
      setText(".sk-cat-name", item.name, category);
    });
  }

  function applyLeadMagnetTranslations() {
    setText("#lead-magnet .slabel", t("lead.label"));
    setHTML("#lead-magnet .stitle", t("lead.titleHtml"));
    setText("#lead-magnet .lead-lede", t("lead.lede"));
    setText('label[for="leadEmail"]', t("lead.emailLabel"));
    setPlaceholder("#leadEmail", t("lead.emailPlaceholder"));
    setText(".lead-consent-text", t("lead.consent"));
    setText("#selectedResourceLabel", t("lead.selectedResourceNone"));
    if (leadSubmitBtn && !leadSubmitBtn.disabled) {
      leadSubmitBtn.textContent = `${t("lead.defaultButton")} ->`;
    }
  }

  function applyContactTranslations() {
    setText("#contact .slabel", t("contact.label"));
    setHTML("#contact .stitle", t("contact.titleHtml"));
    setText("#contact .ct-lede", t("contact.lede"));

    const contactRows = document.querySelectorAll("#contact .ct-row");
    const rows = t("contact.rows", []);
    contactRows.forEach((row, index) => {
      const item = rows[index];
      if (!item) return;
      setText("small", item.label, row);
      if (row.querySelector("span")) setText("span", item.value, row);
    });

    setText("#contact .wa-qr-head small", t("contact.whatsappQr.label"));
    setText("#contact .wa-qr-head span", t("contact.whatsappQr.subtitle"));
    setText("#waQrLink", t("contact.whatsappQr.button"));

    setText('label[for="fn"]', t("contact.form.nameLabel"));
    setPlaceholder("#fn", t("contact.form.namePlaceholder"));
    setText('label[for="fe"]', t("contact.form.emailLabel"));
    setPlaceholder("#fe", t("contact.form.emailPlaceholder"));
    setText('label[for="fs"]', t("contact.form.subjectLabel"));
    setPlaceholder("#fs", t("contact.form.subjectPlaceholder"));
    setText('label[for="fm"]', t("contact.form.messageLabel"));
    setPlaceholder("#fm", t("contact.form.messagePlaceholder"));
  }

  function applyFooterTranslations() {
    setText(".ft-brand", t("footer.brand"));
    setText(".ft-tagline", t("footer.tagline"));

    const year = new Date().getFullYear();
    const footerCopy = document.querySelector(".ft-copy");
    if (footerCopy) {
      footerCopy.innerHTML = `${t("footer.copyPrefix")} <span id="year">${year}</span> ${t("footer.copySuffix")}`;
    }
  }

  function applyModalTranslations() {
    const metaLabels = document.querySelectorAll(".modal-meta .meta-label");
    const metaLabelText = t("modal.metaLabels", []);
    metaLabels.forEach((label, index) => {
      if (metaLabelText[index]) label.textContent = metaLabelText[index];
    });

    const sectionTitles = document.querySelectorAll(".modal-section h4");
    t("modal.sectionTitles", []).forEach((label, index) => {
      if (sectionTitles[index]) sectionTitles[index].textContent = label;
    });

    setText("#modalLink", t("modal.linkLabel"));
  }

  function applyDocumentTranslations() {
    document.title = t("meta.title", document.title);
    H.setAttribute("lang", currentLanguage);

    applyNavTranslations();
    applyHeroTranslations();
    applyAboutTranslations();
    applyServicesTranslations();
    applyIdealClientTranslations();
    applyProjectSectionTranslations();
    applyEducationTranslations();
    applySkillsTranslations();
    applyLeadMagnetTranslations();
    applyContactTranslations();
    applyFooterTranslations();
    applyModalTranslations();
  }

  function syncLanguageControl() {
    if (langSelect) {
      langSelect.value = currentLanguage;
    }
  }

  async function setLanguage(language, options = {}) {
    const normalizedLanguage = normalizeLanguage(language);
    const shouldPersist = options.persist !== false;

    localeData = await fetchLocale(normalizedLanguage);
    currentLanguage = normalizedLanguage;

    if (shouldPersist) {
      localStorage.setItem(LOCALE_STORAGE_KEY, currentLanguage);
    }

    syncLanguageControl();
    applyDocumentTranslations();
    await initLeadResources();

    document.dispatchEvent(new CustomEvent("pk:languagechange", {
      detail: {
        language: currentLanguage,
        translations: localeData
      }
    }));
  }

  function getInitialLanguage() {
    const storedLanguage = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.includes(storedLanguage)) {
      return storedLanguage;
    }

    const browserLanguage = normalizeLanguage((navigator.language || DEFAULT_LANGUAGE).slice(0, 2));
    return browserLanguage || DEFAULT_LANGUAGE;
  }

  setTheme(localStorage.getItem("pk-theme") || "light");

  tBtn?.addEventListener("click", () => {
    setTheme(H.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  window.matchMedia("(prefers-color-scheme:dark)")
    .addEventListener("change", event => {
      if (!localStorage.getItem("pk-theme")) {
        setTheme(event.matches ? "dark" : "light");
      }
    });

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

  document.addEventListener("click", event => {
    if (hamBtn && mobNav && !hamBtn.contains(event.target) && !mobNav.contains(event.target)) {
      closeMob();
    }
  });

  langSelect?.addEventListener("change", event => {
    setLanguage(event.target.value).catch(error => {
      console.error("Language switch failed:", error);
    });
  });

  function setLeadStatus(message, isError = false) {
    if (!leadStatus) return;
    leadStatus.textContent = message;
    leadStatus.style.color = isError ? "#b42318" : "";
  }

  async function downloadSelectedResource(resource) {
    const response = await fetch(resource.file);
    if (!response.ok) {
      throw new Error(`Failed to download resource: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const fileName = resource.file.split("/").pop() || `${resource.id}.pdf`;

    anchor.href = blobUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  function updateLeadButtonLabel() {
    if (!leadSubmitBtn) return;
    if (leadSubmitBtn.disabled) return;

    const label = selectedResource?.buttonLabel || t("lead.defaultButton", "Get selected resource ->");
    leadSubmitBtn.textContent = `${label} ->`;
  }

  function applySelectedResource(resourceId) {
    selectedResource = leadResources.find(resource => resource.id === resourceId) || null;

    if (!selectedResource) return;

    if (leadResourceId) leadResourceId.value = selectedResource.id;
    if (leadResourceTitle) leadResourceTitle.value = selectedResource.title;
    if (selectedResourceLabel) {
      selectedResourceLabel.textContent = `${t("lead.selectedResourcePrefix", "Selected resource:")} ${selectedResource.title}`;
    }

    updateLeadButtonLabel();

    resourceList?.querySelectorAll(".resource-card").forEach(card => {
      card.classList.toggle("is-active", card.getAttribute("data-resource-id") === selectedResource.id);
    });
  }

  function renderLeadResources(resources) {
    if (!resourceList) return;

    resourceList.innerHTML = "";

    resources.forEach(resource => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "resource-card";
      card.setAttribute("data-resource-id", resource.id);
      card.innerHTML = `
        <div class="resource-title">${resource.title}</div>
        <p class="resource-desc">${resource.description}</p>
        <div class="resource-meta">${resource.format}</div>
      `;

      card.addEventListener("click", () => {
        applySelectedResource(resource.id);
        setLeadStatus("");
      });

      resourceList.appendChild(card);
    });

    if (resources[0]) {
      applySelectedResource(resources[0].id);
    }
  }

  async function initLeadResources() {
    if (!resourceList) return;

    try {
      const response = await fetch(`/assets/data/resources.${currentLanguage}.json`);
      if (!response.ok) throw new Error("Failed to load resources.");

      const data = await response.json();
      leadResources = Array.isArray(data)
        ? data.filter(item => item && item.id && item.title && item.file)
        : [];

      if (!leadResources.length) throw new Error("No valid resources found.");

      renderLeadResources(leadResources);
      setLeadStatus("");
    } catch (error) {
      console.error("Lead resources load error:", error);
      setLeadStatus(t("lead.messages.loadFailed"), true);
    }
  }

  if (leadForm) {
    leadForm.addEventListener("submit", async event => {
      event.preventDefault();

      if (BREVO_LEAD_FORM_URL.includes("PASTE_YOUR_BREVO_FORM_ACTION_URL_HERE")) {
        setLeadStatus(t("lead.messages.configureBrevo"), true);
        return;
      }

      if (!selectedResource) {
        setLeadStatus(t("lead.messages.selectResource"), true);
        return;
      }

      const formData = new FormData(leadForm);

      if (!formData.get("EMAIL")) {
        setLeadStatus(t("lead.messages.emailRequired"), true);
        return;
      }

      if (leadSubmitBtn) {
        leadSubmitBtn.disabled = true;
        leadSubmitBtn.textContent = t("lead.messages.submitting");
      }

      try {
        await fetch(BREVO_LEAD_FORM_URL, {
          method: "POST",
          mode: "no-cors",
          body: formData
        });

        setLeadStatus(`${t("lead.messages.preparingPrefix")} ${selectedResource.title}...`);
        leadForm.reset();
        applySelectedResource(selectedResource.id);
        await downloadSelectedResource(selectedResource);
        setLeadStatus(t("lead.messages.downloadSuccess"));
        window.alert(t("lead.messages.alertSuccess"));
      } catch (error) {
        console.error("Brevo lead form error:", error);
        setLeadStatus(t("lead.messages.submitFailed"), true);
      } finally {
        if (leadSubmitBtn) {
          leadSubmitBtn.disabled = false;
          updateLeadButtonLabel();
        }
      }
    });
  }

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
      waQrCanvas.innerHTML = `<p>${t("contact.whatsappQr.unavailable")}</p>`;
    }
  }

  const srEls = Array.from(document.querySelectorAll(".sr"));

  if ("IntersectionObserver" in window && srEls.length) {
    const parentMap = new Map();
    srEls.forEach(el => {
      const parent = el.parentElement;
      if (!parentMap.has(parent)) parentMap.set(parent, []);
      parentMap.get(parent).push(el);
    });

    srEls.forEach(el => {
      const siblings = parentMap.get(el.parentElement) || [];
      const idx = siblings.indexOf(el);
      el.style.animationDelay = `${idx * 0.08}s`;
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

  const navAs = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = Array.from(document.querySelectorAll("section[id]"));

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAs.forEach(anchor => {
            anchor.classList.toggle("act", anchor.getAttribute("href") === `#${id}`);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(section => observer.observe(section));
  }

  setLanguage(getInitialLanguage(), { persist: false }).catch(error => {
    console.error("Initial language load failed:", error);
  });

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
