/* ===================================================
   LuxeStay Hotel Room Management — app.js
   Full JavaScript Application
   =================================================== */

// ===== DATA STORE =====
let rooms = [];
let bookings = [];
let guests = [];
let currentEditRoom = null;
let currentEditBooking = null;

// Sample data for demo
const sampleRooms = [
  { id: 1, number: '101', floor: 1, type: 'Standard', capacity: 2, price: 3500, status: 'available', amenities: ['AC', 'WiFi', 'TV'] },
  { id: 2, number: '102', floor: 1, type: 'Deluxe', capacity: 2, price: 5500, status: 'occupied', amenities: ['AC', 'WiFi', 'TV', 'Mini Bar'] },
  { id: 3, number: '103', floor: 1, type: 'Suite', capacity: 4, price: 8500, status: 'available', amenities: ['AC', 'WiFi', 'TV', 'Balcony', 'Jacuzzi'] },
  { id: 4, number: '201', floor: 2, type: 'Standard', capacity: 2, price: 3500, status: 'maintenance', amenities: ['AC', 'WiFi'] },
  { id: 5, number: '202', floor: 2, type: 'Deluxe', capacity: 3, price: 6000, status: 'available', amenities: ['AC', 'WiFi', 'TV', 'Mini Bar'] },
  { id: 6, number: '203', floor: 2, type: 'Presidential', capacity: 4, price: 12000, status: 'occupied', amenities: ['AC', 'WiFi', 'TV', 'Balcony', 'Jacuzzi', 'Mini Bar'] },
];

const sampleGuests = [
  { id: 1, name: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@email.com', stays: 2 },
  { id: 2, name: 'Priya Singh', phone: '9876543211', email: 'priya@email.com', stays: 1 },
  { id: 3, name: 'Amit Patel', phone: '9876543212', email: 'amit@email.com', stays: 3 },
];

const sampleBookings = [
  { id: 'BK001', guest: 'Rajesh Kumar', room: '102', checkin: '2024-06-15', checkout: '2024-06-18', status: 'checked-in', price: 5500 },
  { id: 'BK002', guest: 'Priya Singh', room: '203', checkin: '2024-06-16', checkout: '2024-06-20', status: 'confirmed', price: 12000 },
  { id: 'BK003', guest: 'Amit Patel', room: '101', checkin: '2024-06-17', checkout: '2024-06-19', status: 'confirmed', price: 3500 },
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  rooms = [...sampleRooms];
  bookings = [...sampleBookings];
  guests = [...sampleGuests];

  initEventListeners();
  renderDashboard();
});

// ===== EVENT LISTENERS =====
function initEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', handleNavigation);
  });

  // Top bar buttons
  document.getElementById('topAddBtn').addEventListener('click', () => openRoomModal());
  document.getElementById('menuToggle').addEventListener('click', toggleSidebar);

  // Room Modal
  document.getElementById('addRoomBtn').addEventListener('click', () => openRoomModal());
  document.getElementById('saveRoomBtn').addEventListener('click', saveRoom);
  document.getElementById('closeRoomModal').addEventListener('click', closeRoomModal);
  document.getElementById('cancelRoomModal').addEventListener('click', closeRoomModal);

  // Booking Modal
  document.getElementById('addBookingBtn').addEventListener('click', () => openBookingModal());
  document.getElementById('saveBookingBtn').addEventListener('click', saveBooking);
  document.getElementById('closeBookingModal').addEventListener('click', closeBookingModal);
  document.getElementById('cancelBookingModal').addEventListener('click', closeBookingModal);

  // Guest Modal
  document.getElementById('addGuestBtn').addEventListener('click', () => openGuestModal());
  document.getElementById('saveGuestBtn').addEventListener('click', saveGuest);
  document.getElementById('closeGuestModal').addEventListener('click', closeGuestModal);
  document.getElementById('cancelGuestModal').addEventListener('click', closeGuestModal);

  // Room Filters
  document.getElementById('roomSearch').addEventListener('input', filterRooms);
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', handleRoomFilter);
  });

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });
}

// ===== NAVIGATION =====
function handleNavigation(e) {
  e.preventDefault();
  const section = e.currentTarget.dataset.section;
  
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  e.currentTarget.classList.add('active');

  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(`section-${section}`).classList.add('active');

  document.getElementById('pageTitle').textContent = section.charAt(0).toUpperCase() + section.slice(1);

  // Render section-specific content
  if (section === 'dashboard') renderDashboard();
  if (section === 'rooms') renderRooms();
  if (section === 'bookings') renderBookings();
  if (section === 'guests') renderGuests();
  if (section === 'housekeeping') renderHousekeeping();
  if (section === 'reports') renderReports();

  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ===== DASHBOARD =====
function renderDashboard() {
  const total = rooms.length;
  const available = rooms.filter(r => r.status === 'available').length;
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const maintenance = rooms.filter(r => r.status === 'maintenance').length;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-available').textContent = available;
  document.getElementById('stat-occupied').textContent = occupied;
  document.getElementById('stat-maintenance').textContent = maintenance;

  renderDashboardRoomGrid();
}

function renderDashboardRoomGrid() {
  const grid = document.getElementById('dashboardRoomGrid');
  grid.innerHTML = rooms.map(room => `
    <div class="floor-room ${room.status}" title="${room.number}">
      ${room.number}
    </div>
  `).join('');
}

// ===== ROOMS =====
function renderRooms() {
  const grid = document.getElementById('roomsGrid');
  grid.innerHTML = rooms.map(room => `
    <div class="room-card ${room.status}">
      <div class="room-header">
        <div>
          <div class="room-number">${room.number}</div>
          <div class="room-type">${room.type} • Floor ${room.floor}</div>
        </div>
        <div class="status-badge ${room.status}">${room.status}</div>
      </div>
      <div class="room-details">
        <p><strong>${room.capacity}</strong> guests</p>
        <p><strong>₹${room.price}</strong>/night</p>
        <div class="amenities">
          ${room.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
        </div>
      </div>
      <div class="room-actions">
        <button class="btn-sm" onclick="editRoom(${room.id})"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn-sm danger" onclick="deleteRoom(${room.id})"><i class="fa-solid fa-trash"></i> Delete</button>
      </div>
    </div>
  `).join('') || '<div class="no-rooms"><i class="fa-solid fa-inbox"></i>No rooms found</div>';
}

function filterRooms() {
  const search = document.getElementById('roomSearch').value.toLowerCase();
  const filtered = rooms.filter(room => 
    room.number.toLowerCase().includes(search) || 
    room.type.toLowerCase().includes(search)
  );
  
  const grid = document.getElementById('roomsGrid');
  grid.innerHTML = filtered.length ? filtered.map(room => `
    <div class="room-card ${room.status}">
      <div class="room-header">
        <div>
          <div class="room-number">${room.number}</div>
          <div class="room-type">${room.type} • Floor ${room.floor}</div>
        </div>
        <div class="status-badge ${room.status}">${room.status}</div>
      </div>
      <div class="room-details">
        <p><strong>${room.capacity}</strong> guests</p>
        <p><strong>₹${room.price}</strong>/night</p>
        <div class="amenities">
          ${room.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
        </div>
      </div>
      <div class="room-actions">
        <button class="btn-sm" onclick="editRoom(${room.id})"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn-sm danger" onclick="deleteRoom(${room.id})"><i class="fa-solid fa-trash"></i> Delete</button>
      </div>
    </div>
  `).join('') : '<div class="no-rooms"><i class="fa-solid fa-inbox"></i>No rooms found</div>';
}

function handleRoomFilter(e) {
  const filter = e.target.dataset.filter;
  
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  e.target.classList.add('active');

  const filtered = filter === 'all' ? rooms : rooms.filter(r => r.status === filter);
  
  const grid = document.getElementById('roomsGrid');
  grid.innerHTML = filtered.map(room => `
    <div class="room-card ${room.status}">
      <div class="room-header">
        <div>
          <div class="room-number">${room.number}</div>
          <div class="room-type">${room.type} • Floor ${room.floor}</div>
        </div>
        <div class="status-badge ${room.status}">${room.status}</div>
      </div>
      <div class="room-details">
        <p><strong>${room.capacity}</strong> guests</p>
        <p><strong>₹${room.price}</strong>/night</p>
        <div class="amenities">
          ${room.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
        </div>
      </div>
      <div class="room-actions">
        <button class="btn-sm" onclick="editRoom(${room.id})"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn-sm danger" onclick="deleteRoom(${room.id})"><i class="fa-solid fa-trash"></i> Delete</button>
      </div>
    </div>
  `).join('') || '<div class="no-rooms"><i class="fa-solid fa-inbox"></i>No rooms found</div>';
}

function openRoomModal(roomId = null) {
  currentEditRoom = roomId ? rooms.find(r => r.id === roomId) : null;
  const modal = document.getElementById('roomModal');
  
  if (currentEditRoom) {
    document.getElementById('modalRoomTitle').textContent = `Edit Room ${currentEditRoom.number}`;
    document.getElementById('roomNumber').value = currentEditRoom.number;
    document.getElementById('roomFloor').value = currentEditRoom.floor;
    document.getElementById('roomType').value = currentEditRoom.type;
    document.getElementById('roomCapacity').value = currentEditRoom.capacity;
    document.getElementById('roomPrice').value = currentEditRoom.price;
    document.getElementById('roomStatus').value = currentEditRoom.status;
    document.getElementById('roomDesc').value = currentEditRoom.description || '';
    
    document.querySelectorAll('.amenity-checks input').forEach(input => {
      input.checked = currentEditRoom.amenities.includes(input.value);
    });
  } else {
    document.getElementById('modalRoomTitle').textContent = 'Add New Room';
    document.getElementById('roomNumber').value = '';
    document.getElementById('roomFloor').value = '';
    document.getElementById('roomType').value = '';
    document.getElementById('roomCapacity').value = '2';
    document.getElementById('roomPrice').value = '';
    document.getElementById('roomStatus').value = 'available';
    document.getElementById('roomDesc').value = '';
    document.querySelectorAll('.amenity-checks input').forEach(input => input.checked = false);
  }
  
  modal.classList.add('open');
}

function closeRoomModal() {
  document.getElementById('roomModal').classList.remove('open');
  currentEditRoom = null;
}

function saveRoom() {
  const number = document.getElementById('roomNumber').value.trim();
  const floor = parseInt(document.getElementById('roomFloor').value);
  const type = document.getElementById('roomType').value;
  const capacity = parseInt(document.getElementById('roomCapacity').value);
  const price = parseInt(document.getElementById('roomPrice').value);
  const status = document.getElementById('roomStatus').value;
  const amenities = Array.from(document.querySelectorAll('.amenity-checks input:checked')).map(i => i.value);

  if (!number || !type || !price) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  if (currentEditRoom) {
    const room = rooms.find(r => r.id === currentEditRoom.id);
    Object.assign(room, { number, floor, type, capacity, price, status, amenities });
  } else {
    rooms.push({
      id: Math.max(...rooms.map(r => r.id), 0) + 1,
      number, floor, type, capacity, price, status, amenities
    });
  }

  showToast(currentEditRoom ? 'Room updated!' : 'Room added!', 'success');
  closeRoomModal();
  renderRooms();
  renderDashboard();
}

function editRoom(id) {
  openRoomModal(id);
}

function deleteRoom(id) {
  if (confirm('Are you sure you want to delete this room?')) {
    rooms = rooms.filter(r => r.id !== id);
    showToast('Room deleted!', 'success');
    renderRooms();
    renderDashboard();
  }
}

// ===== BOOKINGS =====
function renderBookings() {
  const tbody = document.getElementById('bookingsTbody');
  tbody.innerHTML = bookings.map(booking => `
    <tr>
      <td>${booking.id}</td>
      <td>${booking.guest}</td>
      <td>${booking.room}</td>
      <td>${formatDate(booking.checkin)}</td>
      <td>${formatDate(booking.checkout)}</td>
      <td><span class="status-chip ${booking.status}">${booking.status}</span></td>
      <td>
        <div class="tbl-actions">
          <button class="tbl-btn" onclick="editBooking('${booking.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="tbl-btn del" onclick="deleteBooking('${booking.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openBookingModal(bookingId = null) {
  const modal = document.getElementById('bookingModal');
  const roomSelect = document.getElementById('bkRoom');
  
  roomSelect.innerHTML = rooms.map(r => `<option>${r.number}</option>`).join('');

  if (bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    document.getElementById('modalBookingTitle').textContent = `Edit Booking ${booking.id}`;
    document.getElementById('bkGuestName').value = booking.guest;
    document.getElementById('bkPhone').value = booking.phone || '';
    document.getElementById('bkRoom').value = booking.room;
    document.getElementById('bkCheckin').value = booking.checkin;
    document.getElementById('bkCheckout').value = booking.checkout;
    document.getElementById('bkStatus').value = booking.status;
    currentEditBooking = bookingId;
  } else {
    document.getElementById('modalBookingTitle').textContent = 'New Booking';
    document.getElementById('bkGuestName').value = '';
    document.getElementById('bkPhone').value = '';
    document.getElementById('bkCheckin').value = '';
    document.getElementById('bkCheckout').value = '';
    document.getElementById('bkStatus').value = 'confirmed';
    currentEditBooking = null;
  }

  modal.classList.add('open');
}

function closeBookingModal() {
  document.getElementById('bookingModal').classList.remove('open');
  currentEditBooking = null;
}

function saveBooking() {
  const guest = document.getElementById('bkGuestName').value.trim();
  const phone = document.getElementById('bkPhone').value.trim();
  const room = document.getElementById('bkRoom').value;
  const checkin = document.getElementById('bkCheckin').value;
  const checkout = document.getElementById('bkCheckout').value;
  const status = document.getElementById('bkStatus').value;

  if (!guest || !room || !checkin || !checkout) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  if (currentEditBooking) {
    const booking = bookings.find(b => b.id === currentEditBooking);
    Object.assign(booking, { guest, phone, room, checkin, checkout, status });
  } else {
    const id = 'BK' + String(bookings.length + 1).padStart(3, '0');
    bookings.push({ id, guest, phone, room, checkin, checkout, status });
  }

  showToast(currentEditBooking ? 'Booking updated!' : 'Booking created!', 'success');
  closeBookingModal();
  renderBookings();
}

function editBooking(id) {
  openBookingModal(id);
}

function deleteBooking(id) {
  if (confirm('Are you sure you want to delete this booking?')) {
    bookings = bookings.filter(b => b.id !== id);
    showToast('Booking deleted!', 'success');
    renderBookings();
  }
}

// ===== GUESTS =====
function renderGuests() {
  const tbody = document.getElementById('guestsTbody');
  tbody.innerHTML = guests.map(guest => `
    <tr>
      <td>G${String(guest.id).padStart(3, '0')}</td>
      <td>${guest.name}</td>
      <td>${guest.phone}</td>
      <td>${guest.email}</td>
      <td>${guest.stays}</td>
      <td>
        <div class="tbl-actions">
          <button class="tbl-btn" onclick="deleteGuest(${guest.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openGuestModal() {
  document.getElementById('guestName').value = '';
  document.getElementById('guestPhone').value = '';
  document.getElementById('guestEmail').value = '';
  document.getElementById('guestModal').classList.add('open');
}

function closeGuestModal() {
  document.getElementById('guestModal').classList.remove('open');
}

function saveGuest() {
  const name = document.getElementById('guestName').value.trim();
  const phone = document.getElementById('guestPhone').value.trim();
  const email = document.getElementById('guestEmail').value.trim();

  if (!name || !phone) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  guests.push({
    id: Math.max(...guests.map(g => g.id), 0) + 1,
    name, phone, email, stays: 1
  });

  showToast('Guest added!', 'success');
  closeGuestModal();
  renderGuests();
}

function deleteGuest(id) {
  if (confirm('Are you sure you want to delete this guest?')) {
    guests = guests.filter(g => g.id !== id);
    showToast('Guest deleted!', 'success');
    renderGuests();
  }
}

// ===== HOUSEKEEPING =====
function renderHousekeeping() {
  const grid = document.getElementById('hkGrid');
  grid.innerHTML = rooms.map(room => `
    <div class="hk-card">
      <div class="hk-room-no">${room.number}</div>
      <div class="hk-type">${room.type}</div>
      <select class="hk-status-select" onchange="updateHKStatus(${room.id}, this.value)">
        <option value="clean">Clean</option>
        <option value="dirty">Dirty</option>
        <option value="cleaning">Cleaning</option>
        <option value="inspected">Inspected</option>
      </select>
    </div>
  `).join('');
}

function updateHKStatus(roomId, status) {
  showToast(`Room ${rooms.find(r => r.id === roomId).number} marked as ${status}`, 'info');
}

// ===== REPORTS =====
function renderReports() {
  const total = rooms.length;
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = Math.round((occupied / total) * 100);

  document.getElementById('rpt-occupancy').textContent = occupancyRate + '%';
  document.getElementById('rpt-bar').style.width = occupancyRate + '%';

  const typeBreakdown = {};
  rooms.forEach(room => {
    typeBreakdown[room.type] = (typeBreakdown[room.type] || 0) + 1;
  });

  document.getElementById('rpt-breakdown').innerHTML = Object.entries(typeBreakdown)
    .map(([type, count]) => `
      <div class="breakdown-row">
        <span class="breakdown-label">${type}</span>
        <span class="breakdown-val">${count} rooms</span>
      </div>
    `).join('');

  const revenue = rooms
    .filter(r => r.status === 'occupied')
    .reduce((sum, r) => sum + r.price, 0);
  document.getElementById('rpt-revenue').textContent = '₹' + revenue.toLocaleString();

  const activeBookings = bookings.filter(b => 
    b.status === 'confirmed' || b.status === 'checked-in'
  ).length;
  document.getElementById('rpt-bookings').textContent = activeBookings;
}

// ===== UTILITIES =====
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { 
    day: '2-digit', month: 'short', year: 'numeric' 
  });
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Initial render
window.addEventListener('load', () => {
  const firstNav = document.querySelector('.nav-item');
  if (firstNav) firstNav.click();
});
