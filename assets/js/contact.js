// contact.js

// ===== EmailJS Initialization =====
(function () {
  emailjs.init({
    publicKey: "YOUR_PUBLIC_KEY"
  });
})();


// ===== reCAPTCHA callback =====
// This function name MUST match data-callback="onSubmit"
function onSubmit(token) {
  sendEmail();
}


// ===== Main Send Function =====
function sendEmail() {
  const form = document.getElementById("cForm");
  const button = form.querySelector("button");

  // Prevent double clicks
  button.disabled = true;
  button.textContent = "Sending...";

  // Collect form data
  const params = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim()
  };

  // Basic validation (extra safety)
  if (!params.name || !params.email || !params.message) {
    alert("Please fill in all required fields.");
    resetButton(button);
    return;
  }

  // Send email via EmailJS
  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", params)
    .then(function () {
      alert("Message sent successfully!");
      form.reset();
      grecaptcha.reset(); // Reset captcha
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
