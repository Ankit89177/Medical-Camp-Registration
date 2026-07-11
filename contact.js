// ===== CONTACT FORM HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById('full-name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value.trim();

      // ===== VALIDATION =====
      if (!name || !email || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }

      if (phone && !/^[0-9+\-\s()]{10,20}$/.test(phone)) {
        showMessage('Please enter a valid phone number.', 'error');
        return;
      }

      // ===== SUCCESS =====
      // In a real app, you'd send this data to a server
      showMessage(
        `✅ Thank you ${name}! Your message has been sent successfully. We'll get back to you within 24 hours.`,
        'success'
      );

      // Reset form
      contactForm.reset();
    });
  }

  // ===== MESSAGE DISPLAY FUNCTION =====
  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = type;
    formMessage.style.display = 'block';

    // Auto-hide after 6 seconds
    clearTimeout(window.messageTimeout);
    window.messageTimeout = setTimeout(function() {
      formMessage.style.display = 'none';
    }, 6000);
  }
});