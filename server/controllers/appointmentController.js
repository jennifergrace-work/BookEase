const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Availability = require('../models/Availability');
const User = require('../models/User');
const { serializeAppointment } = require('../utils/serializers');

// @desc Calculate available slots for service on given date
// @route GET /api/appointments/slots
exports.getSlots = async (req, res, next) => {
  try {
    const { service: serviceId, date } = req.query;

    if (!serviceId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Parameters service and date (YYYY-MM-DD) are required',
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const avail = await Availability.findOne({ service: serviceId });
    if (!avail) {
      return res.json({ success: true, slots: [], reason: 'No schedule configured for this service' });
    }

    const targetDate = new Date(date);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[targetDate.getUTCDay()];

    if (!avail.workingDays.includes(dayName)) {
      return res.json({
        success: true,
        slots: [],
        reason: `Provider is not available on ${dayName}s for this service`,
      });
    }

    if (avail.blockedDates && avail.blockedDates.includes(date)) {
      return res.json({
        success: true,
        slots: [],
        reason: 'This date is marked as a holiday/blocked date by the service provider',
      });
    }

    // Time calculations
    const timeToMinutes = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const minutesToTime = (min) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const startMin = timeToMinutes(avail.startTime);
    const endMin = timeToMinutes(avail.endTime);
    const breakStartMin = timeToMinutes(avail.breakStart);
    const breakEndMin = timeToMinutes(avail.breakEnd);
    const duration = Math.max(30, service.duration);

    // Existing active bookings
    const booked = await Appointment.find({
      service: serviceId,
      date,
      status: { $ne: 'Cancelled' },
    }).select('timeSlot');

    const bookedSlots = booked.map(b => b.timeSlot);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMin = now.getHours() * 60 + now.getMinutes();

    const slots = [];
    for (let t = startMin; t + duration <= endMin; t += 30) {
      // Overlaps break window
      if (t < breakEndMin && t + duration > breakStartMin) {
        continue;
      }

      const timeStr = minutesToTime(t);
      const isBooked = bookedSlots.includes(timeStr);
      let isPast = false;

      if (date < todayStr || (date === todayStr && t <= currentMin)) {
        isPast = true;
      }

      slots.push({
        time: timeStr,
        available: !isBooked && !isPast,
        reason: isBooked ? 'Already booked' : isPast ? 'Past slot' : undefined,
      });
    }

    return res.json({ success: true, slots });
  } catch (err) {
    next(err);
  }
};

// @desc Book an appointment
// @route POST /api/appointments
exports.bookAppointment = async (req, res, next) => {
  try {
    const { serviceId, date, timeSlot, notes } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Compound conflict check
    const existingBooking = await Appointment.findOne({
      service: serviceId,
      date,
      timeSlot,
      status: { $ne: 'Cancelled' },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This slot was just reserved. Please select another slot.',
      });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      service: serviceId,
      date,
      timeSlot,
      notes: notes || '',
      status: 'Pending',
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('user', 'name email phone')
      .populate('service', 'name price duration category');

    return res.status(201).json({
      success: true,
      message: 'Appointment successfully scheduled!',
      data: serializeAppointment(populated),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get appointments (Admin: all, User: own)
// @route GET /api/appointments
exports.getAppointments = async (req, res, next) => {
  try {
    const { status, date, serviceId, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role !== 'Admin') {
      query.user = req.user._id;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    if (serviceId && serviceId !== 'All') {
      query.service = serviceId;
    }

    if (search) {
      const escapedSearch = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i');
      const [users, services] = await Promise.all([
        User.find({ $or: [{ name: searchRegex }, { email: searchRegex }] }).select('_id'),
        Service.find({ name: searchRegex }).select('_id'),
      ]);
      query.$or = [
        { user: { $in: users.map(user => user._id) } },
        { service: { $in: services.map(service => service._id) } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'name price duration category')
      .sort({ date: -1, timeSlot: 1 })
      .skip(skip)
      .limit(limitNum);

    return res.json({
      success: true,
      data: appointments.map(serializeAppointment),
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc Update appointment status
// @route PUT /api/appointments/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (req.user.role !== 'Admin') {
      if (String(appointment.user) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (status !== 'Cancelled') {
        return res.status(400).json({ success: false, message: 'Clients may only cancel appointments' });
      }
    }

    appointment.status = status;
    await appointment.save();
    const populated = await Appointment.findById(appointment._id)
      .populate('user', 'name email phone')
      .populate('service', 'name price duration category');

    return res.json({
      success: true,
      message: `Appointment marked as ${status}`,
      data: serializeAppointment(populated),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Reschedule appointment
// @route PUT /api/appointments/:id/reschedule
exports.rescheduleAppointment = async (req, res, next) => {
  try {
    const { date, timeSlot } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (req.user.role !== 'Admin' && String(appointment.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      service: appointment.service,
      date,
      timeSlot,
      status: { $ne: 'Cancelled' },
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'The selected slot is already booked. Please choose another slot.',
      });
    }

    appointment.date = date;
    appointment.timeSlot = timeSlot;
    appointment.status = 'Pending';
    await appointment.save();
    const populated = await Appointment.findById(appointment._id)
      .populate('user', 'name email phone')
      .populate('service', 'name price duration category');

    return res.json({
      success: true,
      message: 'Appointment successfully rescheduled',
      data: serializeAppointment(populated),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Delete appointment
// @route DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (req.user.role !== 'Admin' && String(appointment.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Appointment record deleted successfully' });
  } catch (err) {
    next(err);
  }
};
