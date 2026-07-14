// Render admin table
function renderAdminTable() {
  var container = document.getElementById('participant-list');
  var searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
  var stored = JSON.parse(localStorage.getItem('campParticipants')) || [];

  // Search filter
  if (searchTerm) {
    var filtered = [];
    for (var i = 0; i < stored.length; i++) {
      var p = stored[i];
      if (p.name.toLowerCase().includes(searchTerm) || 
          p.campName.toLowerCase().includes(searchTerm) || 
          p.contact.includes(searchTerm)) {
        filtered.push(p);
      }
    }
    stored = filtered;
  }

  updateStats(stored);
  document.getElementById('results-count').textContent = stored.length;

  var clearBtn = document.getElementById('clear-search');
  if (searchTerm.length > 0) {
    clearBtn.classList.add('visible');
  } else {
    clearBtn.classList.remove('visible');
  }

  if (stored.length === 0) {
    container.innerHTML = '<div class="empty-msg"><i class="fas fa-inbox"></i><p>No participants found.</p><p style="margin-top: 0.5rem;"><a href="Register.html"><i class="fas fa-plus-circle"></i> Register a new participant</a></p></div>';
    return;
  }

  var html = '<table><thead><tr><th>#</th><th>Name</th><th>Age</th><th>Contact</th><th>Camp</th><th>Camp Date</th><th>Registered At</th><th>Action</th></tr></thead><tbody>';

  for (var i = 0; i < stored.length; i++) {
    var p = stored[i];
    html += '<tr><td>' + (i + 1) + '</td><td><strong>' + escapeHtml(p.name) + '</strong></td><td>' + p.age + '</td><td>' + escapeHtml(p.contact) + '</td><td><span class="badge-camp">' + escapeHtml(p.campName) + '</span></td><td><span class="badge-date">' + escapeHtml(p.campDate) + '</span></td><td>' + escapeHtml(p.registeredAt) + '</td><td><button class="btn-danger" onclick="deleteParticipant(' + p.id + ')"><i class="fas fa-trash-alt"></i> Delete</button></td></tr>';
  }

  html += '</tbody></table>';
  container.innerHTML = html;
}

// Update stats
function updateStats(data) {
  var all = JSON.parse(localStorage.getItem('campParticipants')) || [];
  document.getElementById('total-count').textContent = all.length;

  if (all.length > 0) {
    var sum = 0;
    for (var i = 0; i < all.length; i++) {
      sum += all[i].age;
    }
    document.getElementById('avg-age').textContent = (sum / all.length).toFixed(1);
  } else {
    document.getElementById('avg-age').textContent = '—';
  }

  var uniqueCamps = {};
  for (var i = 0; i < all.length; i++) {
    uniqueCamps[all[i].campName] = true;
  }
  document.getElementById('camp-count').textContent = Object.keys(uniqueCamps).length;

  var today = new Date().toLocaleDateString();
  var todayCount = 0;
  for (var i = 0; i < all.length; i++) {
    if (new Date(all[i].registeredAt).toLocaleDateString() === today) {
      todayCount++;
    }
  }
  document.getElementById('recent-count').textContent = todayCount;

  var now = new Date();
  document.getElementById('last-updated-time').textContent = now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Delete participant
function deleteParticipant(id) {
  if (!confirm('⚠️ Delete this registration?\n\nThis action cannot be undone.')) return;
  
  var all = JSON.parse(localStorage.getItem('campParticipants')) || [];
  var participant = null;
  var newAll = [];
  
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) {
      participant = all[i];
    } else {
      newAll.push(all[i]);
    }
  }
  
  if (!participant) return;
  
  localStorage.setItem('campParticipants', JSON.stringify(newAll));
  showToast('🗑️ Deleted registration for ' + participant.name);
  renderAdminTable();
}

// Export CSV
function exportCSV() {
  var all = JSON.parse(localStorage.getItem('campParticipants')) || [];
  if (all.length === 0) {
    showToast('⚠️ No data to export.', 'warning');
    return;
  }

  var csv = '"Name","Age","Contact","Camp","Camp Date","Registered At"\n';
  for (var i = 0; i < all.length; i++) {
    var p = all[i];
    csv += '"' + p.name + '",' + p.age + ',"' + p.contact + '","' + p.campName + '","' + p.campDate + '","' + p.registeredAt + '"\n';
  }

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'camp_registrations_' + new Date().toISOString().slice(0, 10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📤 Exported ' + all.length + ' registrations to CSV');
}

// Clear all data
function clearAllData() {
  var all = JSON.parse(localStorage.getItem('campParticipants')) || [];
  if (all.length === 0) {
    showToast('⚠️ No data to clear.', 'warning');
    return;
  }

  if (!confirm('⚠️ Delete ALL data?\n\nThis will permanently delete all registrations.')) return;
  if (!confirm('⚠️ Last chance! Click OK to delete everything.')) return;

  localStorage.removeItem('campParticipants');
  renderAdminTable();
  updateStats([]);
  document.getElementById('results-count').textContent = 0;
  showToast('🗑️ All data has been cleared.');
}

// Refresh data
function refreshData() {
  renderAdminTable();
  showToast('🔄 Data refreshed successfully.');
}

// Search handling
document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('search-input');
  var clearBtn = document.getElementById('clear-search');

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      renderAdminTable();
    });

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        renderAdminTable();
        searchInput.blur();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      searchInput.value = '';
      renderAdminTable();
      searchInput.focus();
    });
  }

  renderAdminTable();
});

// Toast notification
function showToast(message, type) {
  var existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  var toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  
  var bgColor = (type === 'warning') ? '#f59e0b' : '#0b3b5c';
  toast.style.cssText = 'position:fixed;bottom:30px;right:30px;padding:12px 24px;border-radius:12px;background:' + bgColor + ';color:#fff;font-weight:600;font-size:0.95rem;box-shadow:0 8px 30px rgba(0,0,0,0.2);z-index:9999;max-width:400px;font-family:Segoe UI,sans-serif;animation:slideUp 0.4s ease forwards;';

  document.body.appendChild(toast);

  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(function() {
      toast.remove();
    }, 300);
  }, 3000);
}

// Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add animation
var style = document.createElement('style');
style.textContent = '@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }';
document.head.appendChild(style);
