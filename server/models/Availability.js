const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
      unique: true, // One availability configuration per service
    },
    workingDays: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    startTime: {
      type: String,
      required: true,
      default: '09:00', // Format: HH:mm
    },
    endTime: {
      type: String,
      required: true,
      default: '17:00',
    },
    breakStart: {
      type: String,
      default: '13:00',
    },
    breakEnd: {
      type: String,
      default: '14:00',
    },
    blockedDates: {
      type: [String], // Array of YYYY-MM-DD
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Availability', availabilitySchema);
