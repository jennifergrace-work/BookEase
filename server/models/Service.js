const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide service description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      trim: true,
      default: 'Healthcare',
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [15, 'Duration must be at least 15 minutes'],
      max: [240, 'Duration cannot exceed 240 minutes'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
