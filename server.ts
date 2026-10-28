import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'bookease_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// In-Memory Database store with complete Mongoose-compatible schema definitions
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // hashed
  role: 'Admin' | 'User';
  isActive: boolean;
  createdAt: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number; // in minutes
  price: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

interface Availability {
  id: string;
  serviceId: string;
  workingDays: string[]; // e.g., ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  breakStart: string; // "13:00"
  breakEnd: string; // "14:00"
  blockedDates: string[]; // ["2026-11-01", "2026-12-25"]
}

interface Appointment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // "09:00"
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';
  notes: string;
  createdAt: string;
}

// Initial Seed Data
const hashPassword = (plain: string) => bcrypt.hashSync(plain, 10);

let users: User[] = [
  {
    id: 'user-admin-1',
    name: 'Dr. Sarah Mitchell (Admin)',
    email: 'admin@bookease.com',
    phone: '9876543210',
    password: hashPassword('Admin@123'),
    role: 'Admin',
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'user-client-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '9123456780',
    password: hashPassword('User@123'),
    role: 'User',
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'user-client-2',
    name: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    phone: '9988776655',
    password: hashPassword('User@123'),
    role: 'User',
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'user-client-3',
    name: 'Michael Reynolds',
    email: 'michael.r@example.com',
    phone: '9845123456',
    password: hashPassword('User@123'),
    role: 'User',
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  }
];

let services: Service[] = [
  {
    id: 'srv-1',
    name: 'Executive Health & Wellness Check',
    description: 'A comprehensive 45-minute clinical wellness consultation including baseline vitals, metabolic screening, and personalized preventative care roadmap.',
    category: 'Healthcare',
    duration: 45,
    price: 120,
    isActive: true,
    createdBy: 'user-admin-1',
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
  {
    id: 'srv-2',
    name: 'Therapeutic Deep Tissue Massage',
    description: 'Targeted myofascial therapy focusing on chronic muscle tension, structural realignment, and accelerated athletic recovery.',
    category: 'Wellness & Spa',
    duration: 60,
    price: 95,
    isActive: true,
    createdBy: 'user-admin-1',
    createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
  {
    id: 'srv-3',
    name: 'Advanced Dental Hygiene & Polish',
    description: 'Precision ultrasonic scaling, enamel brightening polish, periodontal inspection, and oral cancer screening.',
    category: 'Dental Care',
    duration: 40,
    price: 85,
    isActive: true,
    createdBy: 'user-admin-1',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'srv-4',
    name: 'Precision Hair Styling & Scalp Treatment',
    description: 'Master stylist consultation, deep organic scalp detox, bespoke cut, and styling using botanical conditioning formulas.',
    category: 'Salon & Beauty',
    duration: 50,
    price: 70,
    isActive: true,
    createdBy: 'user-admin-1',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: 'srv-5',
    name: 'Personal Nutrition & Dietetics Roadmap',
    description: 'One-on-one consultation with a licensed clinical nutritionist to build tailored macronutrient plans, gut health protocols, and lifestyle tweaks.',
    category: 'Healthcare',
    duration: 30,
    price: 65,
    isActive: true,
    createdBy: 'user-admin-1',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  }
];

let availabilities: Availability[] = [
  {
    id: 'avail-1',
    serviceId: 'srv-1',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '09:00',
    endTime: '17:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    blockedDates: ['2026-11-26', '2026-12-25'],
  },
  {
    id: 'avail-2',
    serviceId: 'srv-2',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    startTime: '10:00',
    endTime: '18:00',
    breakStart: '13:30',
    breakEnd: '14:30',
    blockedDates: ['2026-12-24', '2026-12-25'],
  },
  {
    id: 'avail-3',
    serviceId: 'srv-3',
    workingDays: ['Monday', 'Wednesday', 'Friday'],
    startTime: '08:30',
    endTime: '16:30',
    breakStart: '12:30',
    breakEnd: '13:30',
    blockedDates: [],
  },
  {
    id: 'avail-4',
    serviceId: 'srv-4',
    workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    startTime: '10:00',
    endTime: '19:00',
    breakStart: '14:00',
    breakEnd: '15:00',
    blockedDates: [],
  },
  {
    id: 'avail-5',
    serviceId: 'srv-5',
    workingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    startTime: '09:00',
    endTime: '16:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    blockedDates: [],
  }
];

// Helper to calculate future date strings
const getOffsetDateStr = (daysAhead: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

let appointments: Appointment[] = [
  {
    id: 'apt-1',
    userId: 'user-client-1',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    serviceId: 'srv-1',
    serviceName: 'Executive Health & Wellness Check',
    servicePrice: 120,
    serviceDuration: 45,
    date: getOffsetDateStr(2),
    timeSlot: '10:00',
    status: 'Confirmed',
    notes: 'Routine biannual checkup; request cholesterol panel check.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'apt-2',
    userId: 'user-client-2',
    userName: 'Sarah Smith',
    userEmail: 'sarah.smith@example.com',
    serviceId: 'srv-2',
    serviceName: 'Therapeutic Deep Tissue Massage',
    servicePrice: 95,
    serviceDuration: 60,
    date: getOffsetDateStr(3),
    timeSlot: '11:00',
    status: 'Pending',
    notes: 'Lower lumbar tightness after marathon training.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'apt-3',
    userId: 'user-client-1',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    serviceId: 'srv-3',
    serviceName: 'Advanced Dental Hygiene & Polish',
    servicePrice: 85,
    serviceDuration: 40,
    date: getOffsetDateStr(-5),
    timeSlot: '09:30',
    status: 'Completed',
    notes: 'Completed full hygiene prophylaxis.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'apt-4',
    userId: 'user-client-3',
    userName: 'Michael Reynolds',
    userEmail: 'michael.r@example.com',
    serviceId: 'srv-4',
    serviceName: 'Precision Hair Styling & Scalp Treatment',
    servicePrice: 70,
    serviceDuration: 50,
    date: getOffsetDateStr(5),
    timeSlot: '15:00',
    status: 'Confirmed',
    notes: 'Pre-wedding event styling.',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'apt-5',
    userId: 'user-client-2',
    userName: 'Sarah Smith',
    userEmail: 'sarah.smith@example.com',
    serviceId: 'srv-5',
    serviceName: 'Personal Nutrition & Dietetics Roadmap',
    servicePrice: 65,
    serviceDuration: 30,
    date: getOffsetDateStr(-2),
    timeSlot: '14:00',
    status: 'Cancelled',
    notes: 'Client rescheduled due to conflicting travel.',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  }
];

// Auth Middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'Admin' | 'User';
    name: string;
  };
}

const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

const requireRole = (role: 'Admin' | 'User') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ success: false, message: `Access denied. Requires ${role} privileges.` });
    }
    next();
  };
};

// Validation helpers
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/\D/g, ''));
};

const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character.' };
  }
  return { valid: true };
};

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all mandatory fields.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({ success: false, message: 'Phone number must be a valid 10-digit number.' });
  }

  const pwdCheck = validatePassword(password);
  if (!pwdCheck.valid) {
    return res.status(400).json({ success: false, message: pwdCheck.message });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  const assignedRole = role === 'Admin' ? 'Admin' : 'User';
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password: hashPassword(password),
    role: assignedRole,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    success: true,
    message: 'User registered successfully!',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      isActive: newUser.isActive,
    }
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    }
  });
});

app.get('/api/auth/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const user = users.find(u => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }
  });
});

app.put('/api/auth/profile', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const user = users.find(u => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { name, phone } = req.body;
  if (name) user.name = name.trim();
  if (phone) {
    if (!validatePhone(phone)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit phone number.' });
    }
    user.phone = phone.trim();
  }

  return res.json({
    success: true,
    message: 'Profile updated successfully.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }
  });
});

app.put('/api/auth/change-password', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const user = users.find(u => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Both current and new passwords are required.' });
  }

  const isMatch = bcrypt.compareSync(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password does not match records.' });
  }

  const pwdCheck = validatePassword(newPassword);
  if (!pwdCheck.valid) {
    return res.status(400).json({ success: false, message: pwdCheck.message });
  }

  user.password = hashPassword(newPassword);

  return res.json({ success: true, message: 'Password changed successfully!' });
});

// ==================== USER MANAGEMENT (Admin Only) ====================
app.get('/api/users', authenticate, requireRole('Admin'), (req: Request, res: Response) => {
  const safeUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt,
  }));
  return res.json({ success: true, data: safeUsers });
});

app.post('/api/users', authenticate, requireRole('Admin'), (req: Request, res: Response) => {
  const { name, email, phone, password, role, isActive } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered.' });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password: hashPassword(password),
    role: role === 'Admin' ? 'Admin' : 'User',
    isActive: isActive !== false,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return res.status(201).json({ success: true, message: 'User created successfully.', data: newUser });
});

app.put('/api/users/:id', authenticate, requireRole('Admin'), (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { name, phone, role, isActive } = req.body;
  if (name) user.name = name.trim();
  if (phone) user.phone = phone.trim();
  if (role) user.role = role === 'Admin' ? 'Admin' : 'User';
  if (typeof isActive === 'boolean') user.isActive = isActive;

  return res.json({ success: true, message: 'User updated successfully.', data: user });
});

app.delete('/api/users/:id', authenticate, requireRole('Admin'), (req: Request, res: Response) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  // Prevent self-deletion of currently logged in admin
  const userToDelete = users[index];
  if (userToDelete.email === 'admin@bookease.com') {
    return res.status(400).json({ success: false, message: 'Primary administrative account cannot be deleted.' });
  }

  users.splice(index, 1);
  return res.json({ success: true, message: 'User deleted successfully.' });
});

// ==================== SERVICE MANAGEMENT ====================
app.get('/api/services', (req: Request, res: Response) => {
  const { category, search, all } = req.query;
  let result = [...services];

  if (all !== 'true') {
    result = result.filter(s => s.isActive);
  }

  if (category && category !== 'All') {
    result = result.filter(s => s.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }

  return res.json({ success: true, data: result });
});

app.get('/api/services/:id', (req: Request, res: Response) => {
  const service = services.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }
  return res.json({ success: true, data: service });
});

app.post('/api/services', authenticate, requireRole('Admin'), (req: AuthenticatedRequest, res: Response) => {
  const { name, description, category, duration, price, isActive } = req.body;
  if (!name || !description || !category || !duration || price === undefined) {
    return res.status(400).json({ success: false, message: 'Please provide all required service parameters.' });
  }

  const newService: Service = {
    id: `srv-${Date.now()}`,
    name: name.trim(),
    description: description.trim(),
    category: category.trim(),
    duration: Number(duration),
    price: Number(price),
    isActive: isActive !== false,
    createdBy: req.user?.id || 'admin',
    createdAt: new Date().toISOString(),
  };

  services.push(newService);

  // Auto-generate default availability for new service
  availabilities.push({
    id: `avail-${Date.now()}`,
    serviceId: newService.id,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '09:00',
    endTime: '17:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    blockedDates: [],
  });

  return res.status(201).json({ success: true, message: 'Service created successfully.', data: newService });
});

app.put('/api/services/:id', authenticate, requireRole('Admin'), (req: Request, res: Response) => {
  const service = services.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }

  const { name, description, category, duration, price, isActive } = req.body;
  if (name) service.name = name.trim();
  if (description) service.description = description.trim();
  if (category) service.category = category.trim();
  if (duration) service.duration = Number(duration);
  if (price !== undefined) service.price = Number(price);
  if (typeof isActive === 'boolean') service.isActive = isActive;

  return res.json({ success: true, message: 'Service updated successfully.', data: service });
});

app.delete('/api/services/:id', authenticate, requireRole('Admin'), (req: Request, res: Response) => {
  const index = services.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }

  services.splice(index, 1);
  return res.json({ success: true, message: 'Service deleted successfully.' });
});

// ==================== AVAILABILITY MANAGEMENT ====================
app.get('/api/availability', (req: Request, res: Response) => {
  const { serviceId } = req.query;
  if (!serviceId) {
    return res.json({ success: true, data: availabilities });
  }
  const avail = availabilities.find(a => a.serviceId === serviceId);
  return res.json({ success: true, data: avail || null });
});

app.post('/api/availability', authenticate, requireRole('Admin'), (req: Request, res: Response) => {
  const { serviceId, workingDays, startTime, endTime, breakStart, breakEnd, blockedDates } = req.body;
  if (!serviceId || !workingDays || !startTime || !endTime) {
    return res.status(400).json({ success: false, message: 'Required availability parameters missing.' });
  }

  let avail = availabilities.find(a => a.serviceId === serviceId);
  if (avail) {
    avail.workingDays = workingDays;
    avail.startTime = startTime;
    avail.endTime = endTime;
    avail.breakStart = breakStart || '13:00';
    avail.breakEnd = breakEnd || '14:00';
    avail.blockedDates = blockedDates || [];
  } else {
    avail = {
      id: `avail-${Date.now()}`,
      serviceId,
      workingDays,
      startTime,
      endTime,
      breakStart: breakStart || '13:00',
      breakEnd: breakEnd || '14:00',
      blockedDates: blockedDates || [],
    };
    availabilities.push(avail);
  }

  return res.json({ success: true, message: 'Availability schedule saved successfully.', data: avail });
});

// ==================== APPOINTMENTS & SLOT CALCULATOR ====================
app.get('/api/appointments/slots', (req: Request, res: Response) => {
  const { service: serviceId, date } = req.query;
  if (!serviceId || !date) {
    return res.status(400).json({ success: false, message: 'Parameters service and date (YYYY-MM-DD) are required.' });
  }

  const service = services.find(s => s.id === serviceId);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }

  const avail = availabilities.find(a => a.serviceId === serviceId);
  if (!avail) {
    return res.json({ success: true, slots: [], message: 'No schedule configured for this service.' });
  }

  const targetDate = new Date(String(date));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[targetDate.getUTCDay()];

  // Check if day is a working day
  if (!avail.workingDays.includes(dayName)) {
    return res.json({
      success: true,
      slots: [],
      reason: `Provider does not operate on ${dayName}s for this service.`
    });
  }

  // Check if date is blocked
  if (avail.blockedDates.includes(String(date))) {
    return res.json({
      success: true,
      slots: [],
      reason: 'This date is marked as blocked/holiday by the provider.'
    });
  }

  // Generate slots from startTime to endTime in intervals of service duration (or 30 mins)
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (totalMin: number) => {
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const startMin = timeToMinutes(avail.startTime);
  const endMin = timeToMinutes(avail.endTime);
  const breakStartMin = timeToMinutes(avail.breakStart);
  const breakEndMin = timeToMinutes(avail.breakEnd);
  const slotInterval = Math.max(30, service.duration);

  const slots: Array<{ time: string; available: boolean; reason?: string }> = [];

  // Existing active appointments for that service & date
  const bookedAppointments = appointments.filter(
    a => a.serviceId === serviceId && a.date === date && a.status !== 'Cancelled'
  );

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let t = startMin; t + slotInterval <= endMin; t += 30) {
    // Skip if overlaps with break time
    if (t < breakEndMin && t + slotInterval > breakStartMin) {
      continue;
    }

    const timeStr = minutesToTime(t);
    const isBooked = bookedAppointments.some(a => a.timeSlot === timeStr);

    let isPast = false;
    if (String(date) === todayStr && t <= currentMinutes) {
      isPast = true;
    } else if (String(date) < todayStr) {
      isPast = true;
    }

    slots.push({
      time: timeStr,
      available: !isBooked && !isPast,
      reason: isBooked ? 'Already booked' : isPast ? 'Past slot' : undefined
    });
  }

  return res.json({ success: true, slots });
});

// Book Appointment
app.post('/api/appointments', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { serviceId, date, timeSlot, notes } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (!serviceId || !date || !timeSlot) {
    return res.status(400).json({ success: false, message: 'Service, date, and timeSlot are required.' });
  }

  const service = services.find(s => s.id === serviceId);
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found.' });
  }

  // Double-booking check: Compound check on service + date + timeSlot where status != 'Cancelled'
  const isConflict = appointments.some(
    a => a.serviceId === serviceId && a.date === date && a.timeSlot === timeSlot && a.status !== 'Cancelled'
  );

  if (isConflict) {
    return res.status(409).json({
      success: false,
      message: 'This time slot was just booked by another client. Please select another slot.'
    });
  }

  const userProfile = users.find(u => u.id === user.id);

  const newAppointment: Appointment = {
    id: `apt-${Date.now()}`,
    userId: user.id,
    userName: userProfile ? userProfile.name : user.name,
    userEmail: userProfile ? userProfile.email : user.email,
    serviceId: service.id,
    serviceName: service.name,
    servicePrice: service.price,
    serviceDuration: service.duration,
    date,
    timeSlot,
    status: 'Pending',
    notes: (notes || '').trim(),
    createdAt: new Date().toISOString(),
  };

  appointments.unshift(newAppointment);

  return res.status(201).json({
    success: true,
    message: 'Appointment scheduled successfully!',
    data: newAppointment,
  });
});

// Get appointments
app.get('/api/appointments', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { status, date, serviceId, search, page = '1', limit = '10' } = req.query;

  let list = [...appointments];

  // If Normal User, only return their own
  if (user.role !== 'Admin') {
    list = list.filter(a => a.userId === user.id);
  }

  if (status && status !== 'All') {
    list = list.filter(a => a.status === status);
  }

  if (date) {
    list = list.filter(a => a.date === date);
  }

  if (serviceId && serviceId !== 'All') {
    list = list.filter(a => a.serviceId === serviceId);
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      a =>
        a.userName.toLowerCase().includes(q) ||
        a.userEmail.toLowerCase().includes(q) ||
        a.serviceName.toLowerCase().includes(q) ||
        a.notes.toLowerCase().includes(q)
    );
  }

  // Pagination
  const pageNum = parseInt(String(page), 10) || 1;
  const limitNum = parseInt(String(limit), 10) || 10;
  const total = list.length;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedItems = list.slice(startIndex, startIndex + limitNum);

  return res.json({
    success: true,
    data: paginatedItems,
    pagination: {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
    }
  });
});

// Update appointment status (Admin or cancellation by client)
app.put('/api/appointments/:id/status', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  const apt = appointments.find(a => a.id === req.params.id);

  if (!apt) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }

  // Normal users can only cancel their own appointments
  if (req.user?.role !== 'Admin') {
    if (apt.userId !== req.user?.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (status !== 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Clients can only cancel appointments.' });
    }
  }

  const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-show'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid appointment status.' });
  }

  apt.status = status;
  return res.json({ success: true, message: `Appointment marked as ${status}.`, data: apt });
});

// Reschedule appointment
app.put('/api/appointments/:id/reschedule', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { date, timeSlot } = req.body;
  const apt = appointments.find(a => a.id === req.params.id);

  if (!apt) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }

  if (req.user?.role !== 'Admin' && apt.userId !== req.user?.id) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  // Check double-booking for the new time
  const conflict = appointments.some(
    a => a.id !== apt.id && a.serviceId === apt.serviceId && a.date === date && a.timeSlot === timeSlot && a.status !== 'Cancelled'
  );

  if (conflict) {
    return res.status(409).json({ success: false, message: 'Selected time slot is already booked. Please choose another.' });
  }

  apt.date = date;
  apt.timeSlot = timeSlot;
  apt.status = 'Pending'; // Return to pending review after reschedule

  return res.json({ success: true, message: 'Appointment rescheduled successfully.', data: apt });
});

// Delete appointment (Admin or creator)
app.delete('/api/appointments/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const index = appointments.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Appointment not found.' });
  }

  const apt = appointments[index];
  if (req.user?.role !== 'Admin' && apt.userId !== req.user?.id) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  appointments.splice(index, 1);
  return res.json({ success: true, message: 'Appointment deleted successfully.' });
});

// ==================== DASHBOARD STATS (Admin) ====================
app.get('/api/stats', authenticate, requireRole('Admin'), (req: Request, res: Response) => {
  const totalAppointments = appointments.length;
  const pending = appointments.filter(a => a.status === 'Pending').length;
  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;
  const noShow = appointments.filter(a => a.status === 'No-show').length;
  const totalUsers = users.length;
  const totalServices = services.length;
  const totalRevenue = appointments
    .filter(a => a.status === 'Completed' || a.status === 'Confirmed')
    .reduce((sum, a) => sum + (a.servicePrice || 0), 0);

  // Status breakdown for visual stats
  const statusCounts = {
    Pending: pending,
    Confirmed: confirmed,
    Completed: completed,
    Cancelled: cancelled,
    'No-show': noShow,
  };

  // Recent activity logs
  const recentActivity = appointments.slice(0, 5).map(a => ({
    id: a.id,
    type: 'appointment',
    title: `${a.userName} booked ${a.serviceName}`,
    time: a.createdAt,
    status: a.status,
  }));

  return res.json({
    success: true,
    data: {
      totalAppointments,
      pending,
      confirmed,
      completed,
      cancelled,
      noShow,
      totalUsers,
      totalServices,
      totalRevenue,
      statusCounts,
      recentActivity,
    }
  });
});

// Reset / Re-seed endpoint for viva demonstration
app.post('/api/seed/reset', (req: Request, res: Response) => {
  // Re-seed demo users
  users = [
    {
      id: 'user-admin-1',
      name: 'Dr. Sarah Mitchell (Admin)',
      email: 'admin@bookease.com',
      phone: '9876543210',
      password: hashPassword('Admin@123'),
      role: 'Admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-client-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '9123456780',
      password: hashPassword('User@123'),
      role: 'User',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-client-2',
      name: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      phone: '9988776655',
      password: hashPassword('User@123'),
      role: 'User',
      isActive: true,
      createdAt: new Date().toISOString(),
    }
  ];
  return res.json({ success: true, message: 'Database reset to pristine seed state.' });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[BookEase Platform] Server listening on port ${PORT}`);
  });
}

startServer();
