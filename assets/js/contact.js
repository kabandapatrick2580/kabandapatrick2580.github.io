// contact.js

// ===== EmailJS Initialization =====
(function () {
  emailjs.init({
    publicKey: "gmwrLP1CGr8WrlEwT"
  });
})();


// ===== Form Submit Handler (Checkbox CAPTCHA flow) =====
const form = document.getElementById("cForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get CAPTCHA token
  const token = grecaptcha.getResponse();

  if (!token) {
    alert("Please complete the CAPTCHA.");
    return;
  }

  sendEmail(token);
});


// ===== Main Send Function =====
function sendEmail(token) {

  const button = form.querySelector("button");

  // Prevent double clicks
  button.disabled = true;
  button.textContent = "Sending...";

  // Collect form data
  const params = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),

    // REQUIRED for EmailJS CAPTCHA verification
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
      grecaptcha.reset(); // Reset checkbox
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
