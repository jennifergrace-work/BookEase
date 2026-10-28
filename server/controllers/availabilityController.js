const Availability = require('../models/Availability');
const { serializeAvailability } = require('../utils/serializers');

// @desc Get availability by service
// @route GET /api/availability
exports.getAvailability = async (req, res, next) => {
  try {
    const { serviceId } = req.query;
    if (!serviceId) {
      const allAvailabilities = await Availability.find().populate('service', 'name duration');
      return res.json({ success: true, data: allAvailabilities.map(serializeAvailability) });
    }

    const avail = await Availability.findOne({ service: serviceId });
    return res.json({ success: true, data: serializeAvailability(avail) });
  } catch (err) {
    next(err);
  }
};

// @desc Save / update availability (Admin)
// @route POST /api/availability
exports.saveAvailability = async (req, res, next) => {
  try {
    const { serviceId, workingDays, startTime, endTime, breakStart, breakEnd, blockedDates } = req.body;

    let avail = await Availability.findOne({ service: serviceId });

    if (avail) {
      avail.workingDays = workingDays;
      avail.startTime = startTime;
      avail.endTime = endTime;
      avail.breakStart = breakStart;
      avail.breakEnd = breakEnd;
      avail.blockedDates = blockedDates || [];
      await avail.save();
    } else {
      avail = await Availability.create({
        service: serviceId,
        workingDays,
        startTime,
        endTime,
        breakStart,
        breakEnd,
        blockedDates: blockedDates || [],
      });
    }

    return res.json({
      success: true,
      message: 'Availability schedule saved successfully',
      data: serializeAvailability(avail),
    });
  } catch (err) {
    next(err);
  }
};
