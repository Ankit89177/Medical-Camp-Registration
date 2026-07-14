// Hamburger menu
document.addEventListener('DOMContentLoaded', function() {
  var hamburger = document.getElementById('hamburger');
  var navbar = document.getElementById('navbar');

  if (hamburger && navbar) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navbar.classList.toggle('active');
    });

    var links = document.querySelectorAll('#navbar ul li a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function() {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
      });
    }
  }
});
