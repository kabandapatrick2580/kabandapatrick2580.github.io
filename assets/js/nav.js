/* ==========================================================
   NAVIGATION HUD: preloader, scrollspy, sliding indicator,
   scroll progress
   ========================================================== */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- preloader (once per session) ---- */
  var pre = document.querySelector(".preloader");
  if (pre) {
    var seen = false;
    try { seen = sessionStorage.getItem("pk-pre") === "1"; } catch (e) {}
    if (seen || reduce) {
      pre.remove();
    } else {
      var count = pre.querySelector("[data-count]");
      var start = performance.now();
      var dur = 2800;
      (function tick(now) {
        var p = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - p, 1.6);
        if (count) count.textContent = String(Math.round(eased * 100));
        if (p < 1) return requestAnimationFrame(tick);
        pre.classList.add("is-done");
        try { sessionStorage.setItem("pk-pre", "1"); } catch (e) {}
        setTimeout(function () { pre.remove(); }, 700);
      })(start);
    }
  }


  /* ---- years of experience: 3 in 2026, +1 every new year ---- */
  function updateYears() {
    var yrs = 3 + Math.max(0, new Date().getFullYear() - 2026);
    var targets = [document.querySelector(".pc-row .pc-v"), document.querySelector(".stat-n")];
    targets.forEach(function (el) {
      if (el && /^\d+\+/.test(el.textContent.trim())) el.textContent = el.textContent.trim().replace(/^\d+/, String(yrs));
    });
  }
  updateYears();
  setTimeout(updateYears, 300);
  document.addEventListener("pk:languagechange", function () { setTimeout(updateYears, 0); });

  /* ---- hero figures count up, slowly, once the page is visible ---- */
  if (!reduce) {
    var wait = document.querySelector(".preloader") ? 3700 : 900;
    setTimeout(function () {
      var figs = Array.prototype.slice.call(document.querySelectorAll(".proof-item strong"));
      figs.forEach(function (el, i) {
        var final = el.textContent.trim();
        var m = final.match(/^([\d.]+)(.*)$/);
        if (!m) return;
        var target = parseFloat(m[1]), suffix = m[2];
        var dec = (m[1].split(".")[1] || "").length;
        el.style.fontVariantNumeric = "tabular-nums";
        el.textContent = (0).toFixed(dec) + suffix;
        setTimeout(function () {
          var t0 = performance.now(), dur = 5000;
          (function step(now) {
            var p = Math.min(1, (now - t0) / dur);
            var e = 1 - Math.pow(1 - p, 2.2);
            el.textContent = p < 1 ? (target * e).toFixed(dec) + suffix : final;
            if (p < 1) requestAnimationFrame(step);
          })(t0);
        }, i * 450);
      });
    }, wait);
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var navList = document.querySelector(".nav-links");
  var ind = document.querySelector(".nav-ind");
  var bar = document.querySelector(".nav-progress");

  /* ---- active section ---- */
  var currentId = "";
  function setActive(id, force) {
    if (id === currentId && !force) return;
    currentId = id;
    navLinks.forEach(function (a) { a.classList.toggle("act", a.getAttribute("href") === "#" + id); });
    moveIndicator();
    setTimeout(moveIndicator, 480);
  }
  function moveIndicator() {
    if (!ind || !navList) return;
    var active = navList.querySelector("a.act");
    if (!active) { ind.style.opacity = "0"; return; }
    var side = window.matchMedia("(min-width: 1024px)").matches;
    var link = active.getBoundingClientRect();
    var list = navList.getBoundingClientRect();
    if (side) {
      ind.style.width = "2px";
      ind.style.height = link.height + "px";
      ind.style.transform = "translateY(" + (link.top - list.top) + "px)";
    } else {
      ind.style.height = "1px";
      ind.style.width = (link.width - 22) + "px";
      ind.style.transform = "translateX(" + (link.left - list.left + 11) + "px)";
    }
    ind.style.opacity = "1";
  }

  var ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.setProperty("--p", max > 0 ? Math.min(1, y / max) : 0);
    var line = window.innerHeight * 0.4;
    var found = sections.length ? sections[0].id : "";
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) found = sections[i].id;
    }
    setActive(found);
  }
  if (navList) navList.addEventListener("transitionend", function (e) { if (e.propertyName === "font-size" || e.propertyName === "padding-top") moveIndicator(); });
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { moveIndicator(); onScroll(); });

  update();
  document.addEventListener("pk:languagechange", function () { setTimeout(moveIndicator, 60); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);
})();
