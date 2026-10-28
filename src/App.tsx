import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ToastNotification';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public & Client Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailsPage } from './pages/ServiceDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { MyAppointmentsPage } from './pages/MyAppointmentsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ServicesManagement } from './pages/admin/ServicesManagement';
import { AvailabilityManagement } from './pages/admin/AvailabilityManagement';
import { AppointmentsManagement } from './pages/admin/AppointmentsManagement';
import { UsersManagement } from './pages/admin/UsersManagement';

// Route Guards
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:id" element={<ServiceDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/book" element={<BookingPage />} />

                {/* Authenticated Client Routes */}
                <Route
                  path="/my-appointments"
                  element={
                    <ProtectedRoute>
                      <MyAppointmentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <RoleRoute role="Admin">
                      <AdminDashboard />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/admin/services"
                  element={
                    <RoleRoute role="Admin">
                      <ServicesManagement />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/admin/availability"
                  element={
                    <RoleRoute role="Admin">
                      <AvailabilityManagement />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/admin/appointments"
                  element={
                    <RoleRoute role="Admin">
                      <AppointmentsManagement />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <RoleRoute role="Admin">
                      <UsersManagement />
                    </RoleRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
