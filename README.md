# BookEase – Appointment Scheduling Platform
**Course Submission**: Web Technology (IA3) Laboratory Project  
**Tech Stack**: MongoDB, Express.js, React.js (Vite), Node.js (MERN)

---

## 🌟 Executive Summary
BookEase is a production-grade full-stack appointment scheduling platform engineered to eliminate scheduling friction between service providers and clients. It features real-time conflict-free slot calculation, compound unique indexing for atomic double-booking prevention, role-based access control (RBAC), and dual-tier form validation (server-side express-validator and real-time client feedback).

---

## 🎨 Color Palette & Typography Specifications
Constructed in strict accordance with project design requirements:
- **Primary (--space-cadet)**: `#1F344F` (Navbar, primary CTA buttons, footer, completed badges)
- **Secondary (--slate-gray)**: `#6182A6` (Focus rings, secondary buttons, confirmed badges)
- **Accent (--tan)**: `#D5B893` (CTA highlights on dark chrome, no-show status badges)
- **Warm Secondary (--coffee)**: `#6F4D38` (Pending appointment badges, category accents)
- **Danger / Destructive (--caput-mortuum)**: `#632024` (Cancellation badges, delete triggers, invalid inputs)
- **Page Canvas (--bg-cream)**: `#F8F3EC` (Warm off-white background)
- **Surface Cards (--surface)**: `#FFFFFF` (Card surfaces, modals)
- **Typography**: `Playfair Display` (Headings) paired with `Inter` (Body text).

---

## 🔐 Evaluation & Viva Demo Credentials

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin / Provider** | `admin@bookease.com` | `Admin@123` | Dashboard analytics, Full Service CRUD, Availability engine, Appointments operations, User management |
| **Normal User / Client** | `john.doe@example.com` | `User@123` | Service catalog, Interactive slot booking, Rescheduling, My Appointments history |
| **Demo Client 2** | `sarah.smith@example.com` | `User@123` | Isolated user view of booked appointments |

*Note: In the live UI, the top navigation includes a 1-click "Viva Demo" switcher to effortlessly toggle between Admin and Client roles without retyping credentials.*

---

## 📂 Project Architecture & Folder Tree
```
BookEase/
├── .env.example                     # Environment variable template
├── README.md                        # Documentation & viva report
├── package.json                     # Root orchestrator dependencies
├── server.ts                        # Legacy in-memory demo server (npm run dev:memory)
├── index.html                       # HTML5 entry point with Google Fonts
│
├── server/                          # Dedicated Backend
│   ├── package.json
│   ├── .env.example
│   ├── server.js                    # Express + Helmet + CORS + Rate Limiting
│   ├── seed.js                      # Database population script
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection handler
│   ├── models/
│   │   ├── User.js                  # User schema with bcrypt pre-save hook
│   │   ├── Service.js               # Service schema (duration, price, category)
│   │   ├── Availability.js          # Working days, operating hours, break times, blocked dates
│   │   └── Appointment.js           # Compound unique index (service + date + timeSlot)
│   ├── middleware/
│   │   ├── auth.js                  # JWT Bearer token authentication
│   │   ├── role.js                  # RBAC role verification
│   │   ├── validate.js              # express-validator result aggregator
│   │   └── errorHandler.js          # Centralized error handler & status codes
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, Me, Profile, Password
│   │   ├── serviceController.js     # Full Service CRUD
│   │   ├── availabilityController.js# Operating hours & holiday blackout manager
│   │   ├── appointmentController.js # Dynamic slot calculator & conflict guard
│   │   └── userController.js        # Admin user accounts management
│   └── routes/
│       ├── authRoutes.js
│       ├── serviceRoutes.js
│       ├── availabilityRoutes.js
│       ├── appointmentRoutes.js
│       └── userRoutes.js
│
└── src/                             # Dedicated Frontend (React 19 + Bootstrap 5)
    ├── main.tsx
    ├── App.tsx                      # Master route configuration
    ├── index.css                    # Strict CSS color system & Bootstrap overrides
    ├── types/                       # TypeScript interfaces
    ├── services/                    # API client layer
    ├── context/                     # AuthContext session provider
    ├── components/
    │   ├── Navbar.tsx               # Brand navbar with Viva quick-switcher
    │   ├── Footer.tsx               # Project info and demo keys
    │   ├── StatusBadge.tsx          # Status badges (Coffee, Slate Gray, Space Cadet, Caput Mortuum, Tan)
    │   ├── ToastNotification.tsx    # Floating toast system
    │   └── ConfirmationModal.tsx    # Accessible confirmation dialogs
    ├── routes/
    │   ├── ProtectedRoute.tsx       # Auth gate
    │   └── RoleRoute.tsx            # RBAC role gate
    └── pages/
        ├── HomePage.tsx             # Landing hero, features, and quick logins
        ├── LoginPage.tsx            # Form validation, password toggle, quick fill
        ├── RegisterPage.tsx         # Real-time password strength meter & 10-digit phone
        ├── ServicesPage.tsx         # Catalog with search, category filtering & sorting
        ├── ServiceDetailsPage.tsx   # Detailed inclusion overview
        ├── BookingPage.tsx          # Step-by-step calendar & conflict-free slot picker
        ├── MyAppointmentsPage.tsx   # Upcoming vs Past tabs, cancellation & rescheduling
        ├── ProfilePage.tsx          # Account data & password modification
        ├── NotFoundPage.tsx         # Custom 404 handler
        └── admin/
            ├── AdminDashboard.tsx   # KPIs, progress distribution bars, activity log
            ├── ServicesManagement.tsx# Full service CRUD with modals
            ├── AvailabilityManagement.tsx # Working days, hours, lunch breaks, blocked dates
            ├── AppointmentsManagement.tsx# Searchable, filterable, paginated appointments table
            └── UsersManagement.tsx  # User account roles and active switches
```

---

## 🚀 Step-by-Step Local Setup Instructions

### 1. Prerequisites
- Node.js (v18.x or v20.x+)
- npm (v9.x+)
- MongoDB Atlas cluster URL or local MongoDB instance

### 2. Environment Variables Configuration
Create `server/.env` using `server/.env.example` as a template. For a local MongoDB service, configure:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/bookease
JWT_SECRET=<a-long-random-secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```
Keep `server/.env` private; never commit it or put database credentials in frontend files.

### 3. Installation & Dependency Resolution
```bash
# In the project root:
npm install
```

### 4. Database Seeding (Optional)
To add the demo users, services, schedules, and appointments without overwriting existing records:
```bash
npm run seed:demo
```
The seeder adds missing demo records and can be rerun safely. It connects to the `bookease` database using `MONGODB_URI` from `server/.env`; keep this file private. The demo admin and client accounts use the credentials printed by the seeder, so change or remove these accounts before using the app with real users.

To check recent local registrations, connect with `mongosh "mongodb://127.0.0.1:27017/bookease"` and run:
```javascript
db.users.find({}, { name: 1, email: 1, role: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(10).pretty()
```

### 5. Starting the Platform
If the old in-memory app is already running on port 3000, stop it with `Ctrl+C` first.
Leave the MongoDB service running.

Open two terminals in the project root:
```bash
# Terminal 1: MongoDB-backed API
npm run dev:api

# Terminal 2: Vite frontend (proxies /api requests to port 5000)
npm run dev
```
Open your browser at `http://localhost:3000`.

### 6. Deploying the frontend and API on Render
Deploy the `server` directory as a Render Web Service, and deploy the repository root as a Render Static Site.

For the API Web Service, set the root directory to `server`, build command to `npm install`, and start command to `npm start`. Configure `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`, `NODE_ENV=production`, and `CLIENT_URL` in Render's environment settings. `CLIENT_URL` must be the frontend's exact public origin, without a trailing slash.

For the Static Site, set the root directory to the repository root, build command to `npm install && npm run build`, and publish directory to `dist`. Set this build-time environment variable to the API's public URL including `/api`:
```env
VITE_API_BASE_URL=https://your-api-service.onrender.com/api
```
After changing this variable, trigger a new Static Site deployment so Vite bakes it into the frontend bundle. Keep database credentials and JWT secrets only in the API Web Service's environment settings.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new client or provider |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current session profile |
| `PUT` | `/api/auth/profile` | Authenticated | Update name or 10-digit phone |
| `PUT` | `/api/auth/change-password` | Authenticated | Verify old password & set new password |

### Services (`/api/services`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services` | Public | Get all active services with search & filter |
| `GET` | `/api/services/:id` | Public | Get single service details |
| `POST` | `/api/services` | Admin | Create service offering with auto-schedule |
| `PUT` | `/api/services/:id` | Admin | Update service details or toggle active |
| `DELETE` | `/api/services/:id` | Admin | Remove service offering |

### Availability (`/api/availability`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/availability?serviceId=` | Public | Get operating hours & blocked dates |
| `POST` | `/api/availability` | Admin | Update workdays, times, breaks, holidays |

### Appointments & Slots (`/api/appointments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/appointments/slots?service=&date=` | Public | Compute real-time conflict-free slots |
| `POST` | `/api/appointments` | Client / Admin | Book slot (with double-booking guard) |
| `GET` | `/api/appointments` | Authenticated | Client gets own; Admin gets searchable/paginated list |
| `PUT` | `/api/appointments/:id/status` | Authenticated | Status lifecycle (Pending → Confirmed → Completed / Cancelled / No-show) |
| `PUT` | `/api/appointments/:id/reschedule`| Authenticated | Reschedule date & slot with conflict validation |
| `DELETE` | `/api/appointments/:id` | Admin / User | Delete appointment record |

### Analytics & User Governance
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/stats` | Admin | Dashboard metrics, pipeline charts, recent feed |
| `GET` | `/api/users` | Admin | List all registered user accounts |
| `POST` | `/api/users` | Admin | Create new user account |
| `PUT` | `/api/users/:id` | Admin | Update details, role (User ↔ Admin), status |
| `DELETE` | `/api/users/:id` | Admin | Delete user account |
| `POST` | `/api/seed/reset` | Public | Reset database to pristine demo state |

---

## 📸 Recommended Viva Screenshots
For the project report, capture screenshots of the following pages:
1. **Landing Page**: Hero banner with custom color palette, features, and 1-click test credentials card.
2. **Interactive Booking**: Date selection and dynamic slot badges (showing active vs disabled booked slots).
3. **Double-Booking Prevention Alert**: Conflict response when attempting duplicate booking.
4. **My Appointments (Client)**: Upcoming vs Past tabs with status badges and reschedule modal.
5. **Admin Operations Dashboard**: KPI stat cards, appointment status distribution bars, and activity logs.
6. **Availability Engine**: Working days, daily hours, lunch break window, and blocked date management.
7. **Appointments CRUD Table**: Search, status dropdown filter, and pagination.
8. **Real-time Form Validation**: Registration form showing inline errors for 10-digit phone and password strength.
