// ===== HAMBURGER MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');

  if (hamburger && navbar) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navbar.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('#navbar ul li a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
      });
    });
  }
});

