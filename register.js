// ===== CAMP DATA =====
const camps = [
  { id: 1, name: 'Downtown Health Camp', date: '2026-07-10', location: 'City Center, Hall A' },
  { id: 2, name: 'Riverside Medical Camp', date: '2026-07-18', location: 'Riverside Community Hall' },
  { id: 3, name: 'Sunset Park Camp', date: '2026-07-25', location: 'Sunset Park, Main Pavilion' },
  { id: 4, name: 'Eye Checkup Camp', date: '2026-08-01', location: 'City Health Center, Rohini' },
  { id: 5, name: 'Dental Health Camp', date: '2026-08-10', location: 'Dental College, Anna Nagar' },
  { id: 6, name: 'Diabetes Screening Drive', date: '2026-08-20', location: 'Community Hall, Andheri' },
];

// ===== POPULATE DROPDOWN =====
document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('camp-select');
  if (select) {
    select.innerHTML = camps.map(camp => `
      <option value="${camp.id}">${camp.name} (${camp.date}) - ${camp.location}</option>
    `).join('');
  }
});

// ===== FORM SUBMISSION =====
const form = document.getElementById('registration-form');
const msgDiv = document.getElementById('registration-message');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const campId = parseInt(document.getElementById('camp-select').value);
    const terms = document.getElementById('terms').checked;

    // ===== VALIDATION =====

    // Check required fields
    if (!name || !age || !contact || !campId) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    // Validate age
    if (isNaN(age) || age < 1 || age > 120) {
      showMessage('Please enter a valid age (1–120).', 'error');
      return;
    }

    // Validate contact number
    if (!/^[0-9]{10,15}$/.test(contact.replace(/\s/g, ''))) {
      showMessage('Please enter a valid contact number (10–15 digits).', 'error');
      return;
    }

    

    // Check terms
    if (!terms) {
      showMessage('Please agree to the Terms & Conditions.', 'error');
      return;
    }

    // Find selected camp
    const camp = camps.find(c => c.id === campId);
    if (!camp) {
      showMessage('Selected camp is invalid.', 'error');
      return;
    }

    // ===== SAVE TO LOCAL STORAGE =====
    let participants = JSON.parse(localStorage.getItem('campParticipants')) || [];
    
    const newParticipant = {
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

    // ===== SUCCESS MESSAGE =====
    showMessage(
      `✅ Registration successful for ${name} at ${camp.name}! 
      A confirmation SMS has been sent to ${contact}.`,
      'success'
    );

    // Reset form
    form.reset();
    document.getElementById('camp-select').value = '';
    
    // Scroll to message
    msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

// ===== MESSAGE DISPLAY FUNCTION =====
function showMessage(text, type) {
  msgDiv.textContent = text;
  msgDiv.className = type;
  msgDiv.style.display = 'block';

  // Auto-hide after 6 seconds
  clearTimeout(window.messageTimeout);
  window.messageTimeout = setTimeout(function() {
    msgDiv.style.display = 'none';
  }, 6000);
}

