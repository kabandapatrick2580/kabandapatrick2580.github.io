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
        sendEmail(token);
      })
      .catch(function (err) {
        console.error("reCAPTCHA error:", err);
        alert("Verification failed. Please try again.");
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
    alert("Please fill in all required fields.");
    resetButton(button);
    return;
  }

  // Send email via EmailJS
  emailjs.send("service_uje6kr9", "template_18pr9hb", params)
    .then(function () {
      alert("Message sent successfully!");
      form.reset();
    })
    .catch(function (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send message. Please try again later.");
    })
    .finally(function () {
      resetButton(button);
    });
}


// ===== Helper: Reset Button =====
function resetButton(button) {
  button.disabled = false;
  button.textContent = "Submit →";
}
