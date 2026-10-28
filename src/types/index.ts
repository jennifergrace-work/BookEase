export type Role = 'Admin' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  isActive: boolean;
  createdAt?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number; // in minutes
  price: number;
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
}

export interface Availability {
  id?: string;
  serviceId: string;
  workingDays: string[];
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  blockedDates: string[];
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface SlotItem {
  time: string;
  available: boolean;
  reason?: string;
}

export interface DashboardStats {
  totalAppointments: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  totalUsers: number;
  totalServices: number;
  totalRevenue: number;
  statusCounts: Record<AppointmentStatus, number>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    time: string;
    status: AppointmentStatus;
  }>;
}
