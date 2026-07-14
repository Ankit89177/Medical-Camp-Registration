// Camp data
const camps = [
  { id: 1, name: 'Downtown Health Camp', date: '2026-07-10', location: 'City Center, Hall A' },
  { id: 2, name: 'Riverside Medical Camp', date: '2026-07-18', location: 'Riverside Community Hall' },
  { id: 3, name: 'Sunset Park Camp', date: '2026-07-25', location: 'Sunset Park, Main Pavilion' },
  { id: 4, name: 'Eye Checkup Camp', date: '2026-08-01', location: 'City Health Center, Rohini' },
  { id: 5, name: 'Dental Health Camp', date: '2026-08-10', location: 'Dental College, Anna Nagar' },
  { id: 6, name: 'Diabetes Screening Drive', date: '2026-08-20', location: 'Community Hall, Andheri' },
];

// Populate dropdown
document.addEventListener('DOMContentLoaded', function() {
  var select = document.getElementById('camp-select');
  if (!select) return;
  
  var options = '';
  for (var i = 0; i < camps.length; i++) {
    var camp = camps[i];
    options += '<option value="' + camp.id + '">' + camp.name + ' (' + camp.date + ') - ' + camp.location + '</option>';
  }
  select.innerHTML = options;
});

// Form handling
var form = document.getElementById('registration-form');
var msgDiv = document.getElementById('registration-message');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var name = document.getElementById('name').value.trim();
    var age = document.getElementById('age').value.trim();
    var contact = document.getElementById('contact').value.trim();
    var campId = parseInt(document.getElementById('camp-select').value);
    var terms = document.getElementById('terms').checked;

    // Validation
    if (!name || !age || !contact || !campId) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    if (isNaN(age) || age < 1 || age > 120) {
      showMessage('Please enter a valid age (1–120).', 'error');
      return;
    }

    if (!/^[0-9]{10,15}$/.test(contact.replace(/\s/g, ''))) {
      showMessage('Please enter a valid contact number (10–15 digits).', 'error');
      return;
    }

    if (!terms) {
      showMessage('Please agree to the Terms & Conditions.', 'error');
      return;
    }

    var camp = null;
    for (var i = 0; i < camps.length; i++) {
      if (camps[i].id === campId) {
        camp = camps[i];
        break;
      }
    }

    if (!camp) {
      showMessage('Selected camp is invalid.', 'error');
      return;
    }

    // Save to localStorage
    var participants = JSON.parse(localStorage.getItem('campParticipants')) || [];
    
    var newParticipant = {
      id: Date.now(),
      name: name,
      age: parseInt(age),
      contact: contact,
      campName: camp.name,
      campDate: camp.date,
      campLocation: camp.location,
      registeredAt: new Date().toLocaleString()
    };

    participants.push(newParticipant);
    localStorage.setItem('campParticipants', JSON.stringify(participants));

    showMessage('✅ Registration successful for ' + name + ' at ' + camp.name + '!', 'success');

    form.reset();
    document.getElementById('camp-select').value = '';
    msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function showMessage(text, type) {
  msgDiv.textContent = text;
  msgDiv.className = type;
  msgDiv.style.display = 'block';

  clearTimeout(window.messageTimeout);
  window.messageTimeout = setTimeout(function() {
    msgDiv.style.display = 'none';
  }, 6000);
}
