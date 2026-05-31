const API_BASE = 'http://localhost:3000/api';

async function fetchBookings() {
  const res = await fetch(`${API_BASE}/bookings`);
  return res.json();
}

async function createBooking(data) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
