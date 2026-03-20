const SITE_KEY = "6LfgH30sAAAAAPB4BwAyO4WL5gNoO5scfdj4t3QX";
const form = document.getElementById("cForm");
const statusEl = document.getElementById("formStatus");
let recaptchaLoaderPromise = null;

(function () {
  if (window.emailjs) {
    emailjs.init({
      publicKey: "gmwrLP1CGr8WrlEwT"
    });
  }
})();

function i18n(path, fallback) {
  if (window.pkI18n && typeof window.pkI18n.get === "function") {
    return window.pkI18n.get(path, fallback);
  }

  return fallback;
}

function setStatus(message, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b42318" : "";
}

function loadRecaptchaV3() {
  if (window.grecaptcha && typeof window.grecaptcha.ready === "function") {
    return Promise.resolve(window.grecaptcha);
  }

  if (recaptchaLoaderPromise) return recaptchaLoaderPromise;

  recaptchaLoaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.grecaptcha) {
        resolve(window.grecaptcha);
      } else {
        reject(new Error("reCAPTCHA loaded but grecaptcha is unavailable."));
      }
    };
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA."));
    document.head.appendChild(script);
  });

  return recaptchaLoaderPromise;
}

function resetButton(button) {
  button.disabled = false;
  button.textContent = i18n("contact.form.submit", "Send message ->");
}

function sendEmail(token) {
  if (!form) return;

  const button = form.querySelector("button");
  button.textContent = i18n("contact.form.sending", "Sending...");

  const params = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),
    "g-recaptcha-response": token
  };

  if (!params.name || !params.email || !params.message) {
    setStatus(i18n("contact.form.messages.required", "Please fill in all required fields."), true);
    resetButton(button);
    return;
  }

  emailjs.send("service_uje6kr9", "template_18pr9hb", params)
    .then(function () {
      setStatus(i18n("contact.form.messages.success", "Message sent successfully."));
      form.reset();
    })
    .catch(function (error) {
      console.error("EmailJS Error:", error);
      setStatus(i18n("contact.form.messages.failed", "Failed to send message. Please try again later."), true);
    })
    .finally(function () {
      resetButton(button);
    });
}

if (form) {
  ["focusin", "pointerenter", "touchstart"].forEach(eventName => {
    form.addEventListener(eventName, () => {
      loadRecaptchaV3().catch(() => {});
    }, { once: true });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const button = form.querySelector("button");
    button.disabled = true;
    button.textContent = i18n("contact.form.verifying", "Verifying...");

    loadRecaptchaV3()
      .then(grecaptcha => {
        grecaptcha.ready(function () {
          grecaptcha.execute(SITE_KEY, { action: "submit" })
            .then(function (token) {
              setStatus(i18n("contact.form.messages.verificationPassed", "Verification passed. Sending your message..."));
              sendEmail(token);
            })
            .catch(function (error) {
              console.error("reCAPTCHA error:", error);
              setStatus(i18n("contact.form.messages.verificationFailed", "Verification failed. Please try again."), true);
              resetButton(button);
            });
        });
      })
      .catch(function (error) {
        console.error("reCAPTCHA load error:", error);
        setStatus(i18n("contact.form.messages.loadFailed", "Verification failed to load. Please try again."), true);
        resetButton(button);
      });
  });
}

document.addEventListener("pk:languagechange", () => {
  if (!form) return;
  const button = form.querySelector("button");
  if (button && !button.disabled) {
    button.textContent = i18n("contact.form.submit", "Send message ->");
  }
  if (statusEl && !statusEl.textContent.trim()) {
    statusEl.textContent = "";
  }
});
