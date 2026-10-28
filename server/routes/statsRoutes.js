const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', protect, authorize('Admin'), statsController.getStats);

module.exports = router;
