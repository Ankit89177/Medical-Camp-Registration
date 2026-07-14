// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
  var contactForm = document.getElementById('contact-form');
  var formMessage = document.getElementById('form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var name = document.getElementById('full-name').value.trim();
      var email = document.getElementById('email').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var subject = document.getElementById('subject').value;
      var message = document.getElementById('message').value.trim();

      // Validation
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

      showMessage('✅ Thank you ' + name + '! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
      contactForm.reset();
    });
  }

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = type;
    formMessage.style.display = 'block';

    clearTimeout(window.messageTimeout);
    window.messageTimeout = setTimeout(function() {
      formMessage.style.display = 'none';
    }, 6000);
  }
});
