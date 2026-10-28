const getId = (document) => {
  if (!document) return '';
  if (typeof document === 'string') return document;
  if (document._id) return String(document._id);
  if (typeof document.toHexString === 'function') return document.toHexString();
  return String(document.id || '');
};

const serializeUser = (user) => {
  if (!user) return null;
  return {
    id: getId(user),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

const serializeService = (service) => {
  if (!service) return null;
  return {
    id: getId(service),
    name: service.name,
    description: service.description,
    category: service.category,
    duration: service.duration,
    price: service.price,
    isActive: service.isActive,
    createdBy: getId(service.createdBy),
    createdAt: service.createdAt,
  };
};

const serializeAvailability = (availability) => {
  if (!availability) return null;
  return {
    id: getId(availability),
    serviceId: getId(availability.service),
    workingDays: availability.workingDays,
    startTime: availability.startTime,
    endTime: availability.endTime,
    breakStart: availability.breakStart,
    breakEnd: availability.breakEnd,
    blockedDates: availability.blockedDates,
  };
};

const serializeAppointment = (appointment) => {
  if (!appointment) return null;
  const user = appointment.user;
  const service = appointment.service;

  return {
    id: getId(appointment),
    userId: getId(user),
    userName: user?.name || '',
    userEmail: user?.email || '',
    serviceId: getId(service),
    serviceName: service?.name || '',
    servicePrice: service?.price ?? 0,
    serviceDuration: service?.duration ?? 0,
    date: appointment.date,
    timeSlot: appointment.timeSlot,
    status: appointment.status,
    notes: appointment.notes || '',
    createdAt: appointment.createdAt,
  };
};

module.exports = {
  serializeUser,
  serializeService,
  serializeAvailability,
  serializeAppointment,
};
