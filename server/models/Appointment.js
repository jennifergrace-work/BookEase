const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String, // HH:mm
      required: [true, 'Time slot is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-show'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Index: prevents double-booking active appointments for same service + date + slot
appointmentSchema.index(
  { service: 1, date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: 'Cancelled' } },
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
