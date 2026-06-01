const BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const res  = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

// List all active services (grouped by category on the frontend)
export const getServices = () => request('/services');

// Get available time slots for a given date + service
export const getAvailability = (date, serviceId) =>
  request(`/availability?date=${date}&service_id=${serviceId}`);

// Submit a booking
export const createBooking = (data) =>
  request('/bookings', { method: 'POST', body: JSON.stringify(data) });

// Look up a returning client by phone (for pre-fill)
export const lookupClient = (phone) =>
  request(`/clients/lookup?phone=${encodeURIComponent(phone)}`).catch(() => null);
