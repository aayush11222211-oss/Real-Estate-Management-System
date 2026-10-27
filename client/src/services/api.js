// API helper for client-server communication
const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('rental_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
};

export const api = {
  auth: {
    async login(email, password) {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(res);
    },

    async register(userData) {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(res);
    },

    async getMe() {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  properties: {
    async getAll(params = {}) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '' && val !== 'All') {
          query.append(key, val);
        }
      });
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${BASE_URL}/properties${queryString}`);
      return handleResponse(res);
    },

    async getRecent() {
      const res = await fetch(`${BASE_URL}/properties/recent`);
      return handleResponse(res);
    },

    async getStats() {
      const res = await fetch(`${BASE_URL}/properties/stats`);
      return handleResponse(res);
    },

    async getById(id) {
      const res = await fetch(`${BASE_URL}/properties/${id}`);
      return handleResponse(res);
    },

    async getMyListings() {
      const res = await fetch(`${BASE_URL}/properties/my/listings`, {
        headers: getHeaders()
      });
      return handleResponse(res);
    },

    async create(propertyData) {
      const res = await fetch(`${BASE_URL}/properties`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(propertyData)
      });
      return handleResponse(res);
    },

    async update(id, propertyData) {
      const res = await fetch(`${BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(propertyData)
      });
      return handleResponse(res);
    },

    async delete(id) {
      const res = await fetch(`${BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  }
};
