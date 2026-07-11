// ========================================
// ADMIN DASHBOARD JAVASCRIPT
// ========================================

// ===== RENDER TABLE =====
function renderAdminTable() {
  const container = document.getElementById('participant-list');
  const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
  let stored = JSON.parse(localStorage.getItem('campParticipants')) || [];

  // Apply search filter
  if (searchTerm) {
    stored = stored.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.campName.toLowerCase().includes(searchTerm) ||
      p.contact.includes(searchTerm)
    );
  }

  // Update stats and results count
  updateStats(stored);
  updateResultsCount(stored.length);

  // Show/hide clear search button
  const clearBtn = document.getElementById('clear-search');
  if (searchTerm.length > 0) {
    clearBtn.classList.add('visible');
  } else {
    clearBtn.classList.remove('visible');
  }

  // Show empty state
  if (stored.length === 0) {
    container.innerHTML = `
      <div class="empty-msg">
        <i class="fas fa-inbox"></i>
        <p>No participants found.</p>
        <p style="margin-top: 0.5rem;">
          <a href="Register.html"><i class="fas fa-plus-circle"></i> Register a new participant</a>
        </p>
      </div>
    `;
    return;
  }

  // Build table
  let html = `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Age</th>
          <th>Contact</th>
          <th>Camp</th>
          <th>Camp Date</th>
          <th>Registered At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  stored.forEach((p, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td><strong>${escapeHtml(p.name)}</strong></td>
        <td>${p.age}</td>
        <td>${escapeHtml(p.contact)}</td>
        <td><span class="badge-camp">${escapeHtml(p.campName)}</span></td>
        <td><span class="badge-date">${escapeHtml(p.campDate)}</span></td>
        <td>${escapeHtml(p.registeredAt)}</td>
        <td>
          <button class="btn-danger" onclick="deleteParticipant(${p.id})">
            <i class="fas fa-trash-alt"></i> Delete
          </button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

// ===== UPDATE STATISTICS =====
function updateStats(data) {
  const all = JSON.parse(localStorage.getItem('campParticipants')) || [];
  
  // Total registrations
  document.getElementById('total-count').textContent = all.length;

  // Average age
  if (all.length > 0) {
    const sum = all.reduce((acc, p) => acc + p.age, 0);
    document.getElementById('avg-age').textContent = (sum / all.length).toFixed(1);
  } else {
    document.getElementById('avg-age').textContent = '—';
  }

  // Unique camps
  const uniqueCamps = new Set(all.map(p => p.campName));
  document.getElementById('camp-count').textContent = uniqueCamps.size;

  // Registered today
  const today = new Date().toLocaleDateString();
  const todayCount = all.filter(p => 
    new Date(p.registeredAt).toLocaleDateString() === today
  ).length;
  document.getElementById('recent-count').textContent = todayCount;

  // Update last updated time
  const now = new Date();
  document.getElementById('last-updated-time').textContent = 
    now.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
}

// ===== UPDATE RESULTS COUNT =====
function updateResultsCount(count) {
  document.getElementById('results-count').textContent = count;
}

// ===== DELETE PARTICIPANT =====
function deleteParticipant(id) {
  if (!confirm('⚠️ Delete this registration?\n\nThis action cannot be undone.')) return;
  
  let all = JSON.parse(localStorage.getItem('campParticipants')) || [];
  const participant = all.find(p => p.id === id);
  
  if (!participant) return;
  
  all = all.filter(p => p.id !== id);
  localStorage.setItem('campParticipants', JSON.stringify(all));
  
  // Show toast notification
  showToast(`🗑️ Deleted registration for ${participant.name}`);
  
  renderAdminTable();
}

// ===== EXPORT CSV =====
function exportCSV() {
  const all = JSON.parse(localStorage.getItem('campParticipants')) || [];
  
  if (all.length === 0) {
    showToast('⚠️ No data to export.', 'warning');
    return;
  }

  // Create CSV content
  let csv = '"Name","Age","Contact","Camp","Camp Date","Registered At"\n';
  all.forEach(p => {
    csv += `"${p.name}",${p.age},"${p.contact}","${p.campName}","${p.campDate}","${p.registeredAt}"\n`;
  });

  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `camp_registrations_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast(`📤 Exported ${all.length} registrations to CSV`);
}

// ===== CLEAR ALL DATA =====
function clearAllData() {
  const all = JSON.parse(localStorage.getItem('campParticipants')) || [];
  
  if (all.length === 0) {
    showToast('⚠️ No data to clear.', 'warning');
    return;
  }

  if (!confirm('⚠️ Delete ALL data?\n\nThis will permanently delete all registrations.')) return;
  if (!confirm('⚠️ Last chance! Click OK to delete everything.')) return;

  localStorage.removeItem('campParticipants');
  renderAdminTable();
  updateStats([]);
  updateResultsCount(0);
  
  showToast('🗑️ All data has been cleared.');
}

// ===== REFRESH DATA =====
function refreshData() {
  renderAdminTable();
  showToast('🔄 Data refreshed successfully.');
}

// ===== SEARCH HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search');

  // Real-time search
  searchInput.addEventListener('input', function() {
    renderAdminTable();
  });

  // Clear search
  clearBtn.addEventListener('click', function() {
    searchInput.value = '';
    renderAdminTable();
    searchInput.focus();
  });

  // Keyboard shortcut: Escape to clear search
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.value = '';
      renderAdminTable();
      searchInput.blur();
    }
  });

  // Initial render
  renderAdminTable();
});

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = message;
  
  // Style
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 12px 24px;
    border-radius: 12px;
    background: ${type === 'warning' ? '#f59e0b' : '#0b3b5c'};
    color: #ffffff;
    font-weight: 600;
    font-size: 0.95rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideUp 0.4s ease forwards;
    max-width: 400px;
    font-family: 'Segoe UI', sans-serif;
  `;

  document.body.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// ===== ESCAPE HTML (Security) =====
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== ADD TOAST ANIMATION =====
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

