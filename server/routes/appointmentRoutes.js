const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const bookingValidation = [
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
  body('timeSlot').matches(/^\d{2}:\d{2}$/).withMessage('Time slot must be in HH:mm format'),
  validate,
];

router.get('/slots', appointmentController.getSlots);
router.post('/', protect, bookingValidation, appointmentController.bookAppointment);
router.get('/', protect, appointmentController.getAppointments);
router.put('/:id/status', protect, appointmentController.updateStatus);
router.put('/:id/reschedule', protect, appointmentController.rescheduleAppointment);
router.delete('/:id', protect, appointmentController.deleteAppointment);

module.exports = router;
