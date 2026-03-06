// contact.js

const SITE_KEY = "6LfgH30sAAAAAPB4BwAyO4WL5gNoO5scfdj4t3QX";
// ===== EmailJS Initialization =====
(function () {
  emailjs.init({
    publicKey: "gmwrLP1CGr8WrlEwT"
  });
})();


// ===== Form Submit Handler (v3 flow) =====
const form = document.getElementById("cForm");
const statusEl = document.getElementById("formStatus");

function setStatus(message, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b42318" : "";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const button = form.querySelector("button");
  button.disabled = true;
  button.textContent = "Verifying...";

  // Wait until reCAPTCHA is ready
  grecaptcha.ready(function () {

    // Generate token for this action
    grecaptcha.execute(SITE_KEY, { action: "submit" })
      .then(function (token) {
        setStatus("Verification passed. Sending your message...");
        sendEmail(token);
      })
      .catch(function (err) {
        console.error("reCAPTCHA error:", err);
        setStatus("Verification failed. Please try again.", true);
        resetButton(button);
      });

  });
});


// ===== Main Send Function =====
function sendEmail(token) {

  const button = form.querySelector("button");
  button.textContent = "Sending...";

  const params = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),

    // 🔑 REQUIRED for EmailJS CAPTCHA verification
    'g-recaptcha-response': token
  };

  // Basic validation
  if (!params.name || !params.email || !params.message) {
    setStatus("Please fill in all required fields.", true);
    resetButton(button);
    return;
  }

  // Send email via EmailJS
  emailjs.send("service_uje6kr9", "template_18pr9hb", params)
    .then(function () {
      setStatus("Message sent successfully.");
      form.reset();
    })
    .catch(function (error) {
      console.error("EmailJS Error:", error);
      setStatus("Failed to send message. Please try again later.", true);
    })
    .finally(function () {
      resetButton(button);
    });
}


// ===== Helper: Reset Button =====
function resetButton(button) {
  button.disabled = false;
  button.textContent = "Send message →";
}
