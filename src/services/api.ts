import { User, Service, Availability, Appointment, SlotItem, DashboardStats } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('bookease_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    register: (userData: any) => request<{ success: boolean; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    login: (credentials: any) => request<{ success: boolean; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    getMe: () => request<{ success: boolean; user: User }>('/auth/me'),
    updateProfile: (profile: { name?: string; phone?: string }) => request<{ success: boolean; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),
    changePassword: (passwords: { currentPassword: string; newPassword: string }) => request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    }),
  },

  // Services
  services: {
    getAll: (params?: { category?: string; search?: string; all?: boolean }) => {
      const q = new URLSearchParams();
      if (params?.category) q.append('category', params.category);
      if (params?.search) q.append('search', params.search);
      if (params?.all) q.append('all', 'true');
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<{ success: boolean; data: Service[] }>(`/services${queryStr}`);
    },
    getById: (id: string) => request<{ success: boolean; data: Service }>(`/services/${id}`),
    create: (data: Partial<Service>) => request<{ success: boolean; data: Service; message: string }>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: Partial<Service>) => request<{ success: boolean; data: Service; message: string }>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/services/${id}`, {
      method: 'DELETE',
    }),
  },

  // Availability
  availability: {
    getByService: (serviceId: string) => request<{ success: boolean; data: Availability | null }>(`/availability?serviceId=${serviceId}`),
    save: (data: Availability) => request<{ success: boolean; data: Availability; message: string }>('/availability', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // Appointments & Slots
  appointments: {
    getSlots: (serviceId: string, date: string) => request<{ success: boolean; slots: SlotItem[]; reason?: string }>(`/appointments/slots?service=${serviceId}&date=${date}`),
    getAll: (params?: { status?: string; date?: string; serviceId?: string; search?: string; page?: number; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.status) q.append('status', params.status);
      if (params?.date) q.append('date', params.date);
      if (params?.serviceId) q.append('serviceId', params.serviceId);
      if (params?.search) q.append('search', params.search);
      if (params?.page) q.append('page', String(params.page));
      if (params?.limit) q.append('limit', String(params.limit));
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<{
        success: boolean;
        data: Appointment[];
        pagination: { total: number; page: number; totalPages: number; limit: number };
      }>(`/appointments${queryStr}`);
    },
    book: (data: { serviceId: string; date: string; timeSlot: string; notes?: string }) => request<{ success: boolean; data: Appointment; message: string }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    updateStatus: (id: string, status: string) => request<{ success: boolean; data: Appointment; message: string }>(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
    reschedule: (id: string, date: string, timeSlot: string) => request<{ success: boolean; data: Appointment; message: string }>(`/appointments/${id}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify({ date, timeSlot }),
    }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/appointments/${id}`, {
      method: 'DELETE',
    }),
  },

  // Users (Admin)
  users: {
    getAll: () => request<{ success: boolean; data: User[] }>('/users'),
    create: (data: any) => request<{ success: boolean; data: User; message: string }>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => request<{ success: boolean; data: User; message: string }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/users/${id}`, {
      method: 'DELETE',
    }),
  },

  // Dashboard Stats
  stats: {
    get: () => request<{ success: boolean; data: DashboardStats }>('/stats'),
  },
};
