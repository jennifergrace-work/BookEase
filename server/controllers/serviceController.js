const Service = require('../models/Service');
const Availability = require('../models/Availability');
const { serializeService } = require('../utils/serializers');

// @desc Get all services (with search, category, active filters)
// @route GET /api/services
exports.getServices = async (req, res, next) => {
  try {
    const { category, search, all } = req.query;
    const query = {};

    if (all !== 'true') {
      query.isActive = true;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: services.length, data: services.map(serializeService) });
  } catch (err) {
    next(err);
  }
};

// @desc Get single service
// @route GET /api/services/:id
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.json({ success: true, data: serializeService(service) });
  } catch (err) {
    next(err);
  }
};

// @desc Create service (Admin)
// @route POST /api/services
exports.createService = async (req, res, next) => {
  try {
    const { name, description, category, duration, price, isActive } = req.body;

    const service = await Service.create({
      name,
      description,
      category,
      duration,
      price,
      isActive: isActive !== false,
      createdBy: req.user._id,
    });

    // Create default availability for the new service
    await Availability.create({
      service: service._id,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '09:00',
      endTime: '17:00',
      breakStart: '13:00',
      breakEnd: '14:00',
      blockedDates: [],
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully with default schedule',
      data: serializeService(service),
    });
  } catch (err) {
    next(err);
  }
};

// @desc Update service (Admin)
// @route PUT /api/services/:id
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    return res.json({ success: true, message: 'Service updated successfully', data: serializeService(service) });
  } catch (err) {
    next(err);
  }
};

// @desc Delete service (Admin)
// @route DELETE /api/services/:id
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await Availability.findOneAndDelete({ service: req.params.id });
    return res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    next(err);
  }
};
