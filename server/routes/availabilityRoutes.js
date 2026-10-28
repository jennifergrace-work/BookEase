const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', availabilityController.getAvailability);
router.post('/', protect, authorize('Admin'), availabilityController.saveAvailability);

module.exports = router;
