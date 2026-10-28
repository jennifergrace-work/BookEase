const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');

const serviceValidation = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('duration').isInt({ min: 15, max: 240 }).withMessage('Duration must be between 15 and 240 minutes'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  validate,
];

router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', protect, authorize('Admin'), serviceValidation, serviceController.createService);
router.put('/:id', protect, authorize('Admin'), serviceController.updateService);
router.delete('/:id', protect, authorize('Admin'), serviceController.deleteService);

module.exports = router;
