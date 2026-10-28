const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const User = require('../models/User');
const { serializeAppointment } = require('../utils/serializers');

const appointmentStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-show'];

exports.getStats = async (req, res, next) => {
  try {
    const [
      totalAppointments,
      totalUsers,
      totalServices,
      recentAppointments,
      revenueAppointments,
      ...statusTotals
    ] = await Promise.all([
      Appointment.countDocuments(),
      User.countDocuments(),
      Service.countDocuments(),
      Appointment.find()
        .populate('user', 'name email phone')
        .populate('service', 'name price duration category')
        .sort({ createdAt: -1 })
        .limit(5),
      Appointment.find({ status: { $in: ['Completed', 'Confirmed'] } })
        .populate('service', 'price'),
      ...appointmentStatuses.map(status => Appointment.countDocuments({ status })),
    ]);

    const statusCounts = Object.fromEntries(
      appointmentStatuses.map((status, index) => [status, statusTotals[index]])
    );
    const recentActivity = recentAppointments.map(appointment => {
      const item = serializeAppointment(appointment);
      return {
        id: item.id,
        type: 'appointment',
        title: `${item.userName} booked ${item.serviceName}`,
        time: item.createdAt,
        status: item.status,
      };
    });

    return res.json({
      success: true,
      data: {
        totalAppointments,
        pending: statusCounts.Pending,
        confirmed: statusCounts.Confirmed,
        completed: statusCounts.Completed,
        cancelled: statusCounts.Cancelled,
        noShow: statusCounts['No-show'],
        totalUsers,
        totalServices,
        totalRevenue: revenueAppointments.reduce(
          (total, appointment) => total + (appointment.service?.price || 0),
          0
        ),
        statusCounts,
        recentActivity,
      },
    });
  } catch (err) {
    next(err);
  }
};
